import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import {
  getReconciliationById,
  updateReconciliation,
  getUnreconciledEntriesByReconciliationId,
  getUnreconciledCashTransactionsByReconciliationId,
  completeReconciliation,
  reversecompleteReconciliation,
} from "@/features/accounts/reconciliation/api/reconciliation.api";
import { createReconciliationCashTransaction } from "@/features/accounts/reconciliation/api/reconciliation-cash-transaction.api";
import { createReconciliationReconcilableEntry } from "@/features/accounts/reconciliation/api/reconciliation-reconcilable-entry.api";
import type { ReconciliationDetailDto } from "@/features/accounts/reconciliation/types/dto";
import { useTabContext } from "@/app/providers/TabProvider";

// ★ 新增：方向工具
import {
  type DirectionalDiffs,
  type DirectionCode,
  normalizeDirection,
  signedAmount,
  toFixed2Number,
} from "@/features/accounts/reconciliation/utils/direction";

// -------- 型別定義（提供給頁面使用） --------
export type ActiveTab = "cash" | "entries";

export type SelectableReconciliationItem = {
  id: string;
  referenceNumber: string;
  entryAmount: number;
  remainingAmount: number;
  note?: string;
  entryDate?: string; // ReconcilableEntry 用
  transactionDate?: string; // CashTransaction 用
  entryType?: string; // ReconcilableEntry 用
};

export type SelectedReconciliationItem = {
  id: string;
  remainingAmount: number;
  entryType?: string;
};

type UseReconciliationDetailResult = {
  // 資料
  detail?: ReconciliationDetailDto;
  loading: boolean;

  // Tab
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // 表單唯讀 / 狀態
  isReadOnly: boolean;

  // ★ 方向後的差額明細與字串
  diffs: DirectionalDiffs;
  diffString: string;
  isBalanced: boolean;
  getAmountColor: (amountString: string) => string;

  // 表單提交（更新 referenceNumber / note）
  handleFormSubmit: (values: { referenceNumber?: string; note?: string }) => Promise<void>;

  // 完成對沖
  completing: boolean;
  handleComplete: () => Promise<void>;

  // 對沖反轉
  reversecompleting: boolean;
  handleReverseComplete: () => Promise<void>;

  // 重新載入（提供給子表格 onChanged 後呼叫）
  fetchDetail: () => Promise<void>;

  // Modal 狀態與行為
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  modalLoading: boolean;
  modalItems: SelectableReconciliationItem[];
  modalPage: number;
  modalPageSize: number;
  modalTotal: number;

  handleAdd: () => Promise<void>;
  handleModalPageChange: (page: number, pageSize: number) => Promise<void>;
  handleSubmit: (selectedItems: SelectedReconciliationItem[]) => Promise<void>;
};

export function useReconciliationDetail(id: string | undefined): UseReconciliationDetailResult {
  const { updateTabTitle } = useTabContext();

  const [detail, setDetail] = useState<ReconciliationDetailDto | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<ActiveTab>("cash");

  // Modal 狀態
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalItems, setModalItems] = useState<SelectableReconciliationItem[]>([]);
  const [modalPage, setModalPage] = useState<number>(1);
  const [modalPageSize, setModalPageSize] = useState<number>(20);
  const [modalTotal, setModalTotal] = useState<number>(0);

  // 完成對沖中的 loading
  const [completing, setCompleting] = useState<boolean>(false);
  const [reversecompleting, setReverseCompleting] = useState<boolean>(false);

  const fetchDetail = useCallback(async (): Promise<void> => {
    if (!id) {
      return;
    }

    setLoading(true);
    try {
      const data: ReconciliationDetailDto = await getReconciliationById(id);
      setDetail(data);

      const displayText: string = data.referenceNumber ?? data.id ?? "";
      updateTabTitle(`/reconciliations/${id}`, `沖帳單：${displayText}`);
    } catch (error: unknown) {
      message.error("資料載入失敗");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, updateTabTitle]);

  useEffect((): void => {
    void fetchDetail();
  }, [fetchDetail]);

  // -------- 方向相關：開始 --------

  // ★ 從各種欄位猜測/正規化方向
  const pickDirection = (x: unknown): DirectionCode | undefined => {
    // 盡可能從常見欄位推：direction、directionCode、directionType、entryType
    const anyX = x as {
      direction?: string | number;
      directionCode?: string | number;
      directionType?: string | number;
      entryType?: string | number; // ReconcilableEntry 常見的欄位
    };

    const fromDirection: DirectionCode | undefined = normalizeDirection(anyX?.direction);
    if (fromDirection !== undefined) {
      return fromDirection;
    }

    const fromDirectionCode: DirectionCode | undefined = normalizeDirection(anyX?.directionCode);
    if (fromDirectionCode !== undefined) {
      return fromDirectionCode;
    }

    const fromDirectionType: DirectionCode | undefined = normalizeDirection(anyX?.directionType);
    if (fromDirectionType !== undefined) {
      return fromDirectionType;
    }

    const fromEntryType: DirectionCode | undefined = normalizeDirection(anyX?.entryType);
    if (fromEntryType !== undefined) {
      return fromEntryType;
    }

    return undefined;
  };

  // ★ 計算方向後的彙總差額
  const diffs: DirectionalDiffs = useMemo((): DirectionalDiffs => {
    if (!detail) {
      return {
        cashIn: 0,
        cashOut: 0,
        cashNet: 0,
        entryIn: 0,
        entryOut: 0,
        entryNet: 0,
        net: 0,
      };
    }

    // 現金金流
    let cashIn: number = 0;
    let cashOut: number = 0;

    for (const tx of detail.cashTransactionLinks ?? []) {
      const dir: DirectionCode | undefined = pickDirection(tx);
      const amount: number = Number(tx.amount ?? 0);
      const s: number = signedAmount(amount, dir);

      if (s >= 0) {
        cashIn += s;
      } else {
        cashOut += Math.abs(s);
      }
    }

    // 帳務項目
    let entryIn: number = 0;
    let entryOut: number = 0;

    for (const e of detail.reconcilableEntryLinks ?? []) {
      const dir: DirectionCode | undefined = pickDirection(e);
      const amount: number = Number(e.amount ?? 0);
      const s: number = signedAmount(amount, dir);

      if (s >= 0) {
        entryIn += s;
      } else {
        entryOut += Math.abs(s);
      }
    }

    const cashNet: number = cashIn - cashOut;
    const entryNet: number = entryIn - entryOut;

    // 總淨額 = 金流淨額 - 帳務淨額（= 0 代表平帳）
    const net: number = cashNet - entryNet;

    return {
      cashIn: toFixed2Number(cashIn),
      cashOut: toFixed2Number(cashOut),
      cashNet: toFixed2Number(cashNet),
      entryIn: toFixed2Number(entryIn),
      entryOut: toFixed2Number(entryOut),
      entryNet: toFixed2Number(entryNet),
      net: toFixed2Number(net),
    };
  }, [detail]);

  // -------- 方向相關：結束 --------

  const getAmountColor = useMemo(() => {
    return (amountString: string): string => {
      const amount: number = parseFloat(amountString);
      if (amount > 0) {
        return "green";
      }
      if (amount < 0) {
        return "red";
      }
      return "inherit";
    };
  }, []);

  // ★ diffString 與 isBalanced 全部改以方向後的 net 判斷
  const diffString: string = useMemo((): string => {
    return (detail ? diffs.net : 0).toFixed(2);
  }, [detail, diffs.net]);

  const isReadOnly: boolean = useMemo((): boolean => {
    if (!detail) {
      return false;
    }
    const statusLike = detail as unknown as {
      status?: string;
      isCompleted?: boolean;
      isLocked?: boolean;
    };
    return (
      statusLike.status === "Completed" ||
      statusLike.isCompleted === true ||
      statusLike.isLocked === true
    );
  }, [detail]);

  const isBalanced: boolean = useMemo((): boolean => {
    // 以兩位小數判斷是否為 0
    return toFixed2Number(diffs.net) === 0;
  }, [diffs.net]);

  const fetchModalData = useCallback(
    async (page: number, pageSize: number): Promise<void> => {
      if (!id) {
        return;
      }
      setModalLoading(true);
      try {
        if (activeTab === "cash") {
          const res = await getUnreconciledCashTransactionsByReconciliationId(id, {
            page,
            pageSize,
          });
          setModalItems(
            res.items.map((x) => {
              return {
                id: x.id,
                referenceNumber: x.referenceNumber ?? "",
                transactionDate: x.transactionDate,
                entryAmount: x.amount,
                remainingAmount: x.remainingAmount,
                note: x.note,
              } as SelectableReconciliationItem;
            })
          );
          setModalTotal(res.totalCount);
          setModalPage(res.page);
          setModalPageSize(res.pageSize);
        } else {
          const candidates = await getUnreconciledEntriesByReconciliationId(id);
          setModalItems(
            candidates.map((x) => {
              return {
                id: x.id,
                referenceNumber: x.referenceNumber ?? "",
                entryDate: x.dueDate,
                entryAmount: x.originalAmount,
                remainingAmount: x.remainingAmount,
                note: "",
                entryType: x.entryType,
              } as SelectableReconciliationItem;
            })
          );
          setModalTotal(candidates.length);
          setModalPage(1);
          setModalPageSize(pageSize);
        }
      } catch (error) {
        console.error(error);
        message.error("載入候選資料失敗");
        setModalOpen(false);
      } finally {
        setModalLoading(false);
      }
    },
    [id, activeTab]
  );

  const handleAdd = useCallback(async (): Promise<void> => {
    if (!id || !detail) {
      return;
    }
    setModalPage(1);
    setModalPageSize(20);
    setModalOpen(true);
    await fetchModalData(1, 20);
  }, [id, detail, fetchModalData]);

  const handleModalPageChange = useCallback(
    async (page: number, pageSize: number): Promise<void> => {
      const nextPage: number = pageSize !== modalPageSize ? 1 : page;
      setModalPage(nextPage);
      setModalPageSize(pageSize);
      await fetchModalData(nextPage, pageSize);
    },
    [modalPageSize, fetchModalData]
  );

  const handleSubmit = useCallback(
    async (selectedItems: SelectedReconciliationItem[]): Promise<void> => {
      if (!id) {
        return;
      }
      setModalLoading(true);
      try {
        for (const item of selectedItems) {
          if (activeTab === "cash") {
            await createReconciliationCashTransaction(id, {
              cashtransactionid: item.id,
            });
          } else {
            await createReconciliationReconcilableEntry(id, {
              ReconcilableEntryId: item.id,
            });
          }
        }
        message.success("新增成功");
        await fetchDetail();
        setModalOpen(false);
      } catch (error) {
        console.error(error);
        message.error("新增失敗");
      } finally {
        setModalLoading(false);
      }
    },
    [id, activeTab, fetchDetail]
  );

  const handleFormSubmit = useCallback(
    async (values: { referenceNumber?: string; note?: string }): Promise<void> => {
      if (!id) {
        return;
      }
      try {
        await updateReconciliation(id, {
          referenceNumber: values.referenceNumber ?? "",
          note: values.note,
        });
        message.success("更新成功");
        await fetchDetail();
      } catch (error) {
        console.error(error);
        message.error("更新失敗");
      }
    },
    [id, fetchDetail]
  );

  const handleReverseComplete = useCallback(async (): Promise<void> => {
    if (!id) {
      return;
    }
    setReverseCompleting(true);
    try {
      await reversecompleteReconciliation(id);
      message.success("已完成對沖，畫面鎖定");
      await fetchDetail();
    } catch (error) {
      message.error("完成對沖失敗");
      console.log(error);
    } finally {
      setReverseCompleting(false);
    }
  }, [id, fetchDetail]);

    const handleComplete = useCallback(async (): Promise<void> => {
    if (!id) {
      return;
    }
    setCompleting(true);
    try {
      await completeReconciliation(id);
      message.success("已完成對沖，畫面鎖定");
      await fetchDetail();
    } catch (error) {
      message.error("完成對沖失敗");
      console.log(error);
    } finally {
      setCompleting(false);
    }
  }, [id, fetchDetail]);

  return {
    detail,
    loading,

    activeTab,
    setActiveTab,

    isReadOnly,

    // ★ 新增輸出
    diffs,
    diffString,
    isBalanced,
    getAmountColor,

    handleFormSubmit,

    completing,
    handleComplete,

    reversecompleting,
    handleReverseComplete,

    fetchDetail,

    modalOpen,
    setModalOpen,
    modalLoading,
    modalItems,
    modalPage,
    modalPageSize,
    modalTotal,

    handleAdd,
    handleModalPageChange,
    handleSubmit,
  };
}
