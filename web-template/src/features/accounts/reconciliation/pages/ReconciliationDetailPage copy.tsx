import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import {
  Card,
  Spin,
  message,
  Tabs,
  Divider,
  Descriptions,
  Button,
  Popconfirm,
  Tag,
  Tooltip,
} from "antd";
import {
  getReconciliationById,
  updateReconciliation,
  // 新增：查未沖銷帳務與未沖銷金流
  getUnreconciledEntriesByReconciliationId,
  getUnreconciledCashTransactionsByReconciliationId,
  // ✅ 新增：完成對沖 API（請在 reconciliation.api.ts 實作這個方法）
  completeReconciliation,
} from "@/features/accounts/reconciliation/api/reconciliation.api";
import { createReconciliationCashTransaction } from "@/features/accounts/reconciliation/api/reconciliation-cash-transaction.api";
import { createReconciliationReconcilableEntry } from "@/features/accounts/reconciliation/api/reconciliation-reconcilable-entry.api";

import type { ReconciliationDetailDto } from "@/features/accounts/reconciliation/types/dto";

import { useTabContext } from "@/app/providers/TabProvider";
import { tReconciliation } from "@/shared/i18n/helpers";
import ReconciliationCashTransactionList from "../components/tables/ReconciliationCashTransactionList";
import ReconciliationReconcilableEntryList from "../components/tables/ReconciliationReconcilableEntryList";
import SelectableListModal from "@/shared/ui/modals/SelectableListModal";

// -------- 型別定義 --------
type SelectableReconciliationItem = {
  id: string;
  referenceNumber: string;
  entryAmount: number;
  remainingAmount: number;
  note?: string;
  entryDate?: string; // ReconcilableEntry 用
  transactionDate?: string; // CashTransaction 用
  entryType?: string; // ReconcilableEntry 用
};

type SelectedReconciliationItem = {
  id: string;
  remainingAmount: number;
  entryType?: string;
};

const ReconciliationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<ReconciliationDetailDto>();
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"cash" | "entries">("cash");

  // Modal 狀態
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalItems, setModalItems] = useState<SelectableReconciliationItem[]>(
    []
  );
  // 分頁（只在 entries 分頁，也就是新增金流時用到遠端分頁）
  const [modalPage, setModalPage] = useState<number>(1);
  const [modalPageSize, setModalPageSize] = useState<number>(20);
  const [modalTotal, setModalTotal] = useState<number>(0);

  // ✅ 新增：完成對沖中的 loading
  const [completing, setCompleting] = useState<boolean>(false);

  const { updateTabTitle } = useTabContext();

  const fetchDetail = useCallback(async (): Promise<void> => {
    if (!id) {
      return;
    }

    setLoading(true);
    try {
      const data = await getReconciliationById(id);
      setDetail(data);

      const displayText: string = data.referenceNumber ?? data.id ?? "";
      updateTabTitle(`/reconciliations/${id}`, `沖帳單：${displayText}`);
    } catch (error: unknown) {
      message.error("資料載入失敗");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, updateTabTitle]); // ⬅ 不要把 message 放進依賴

  useEffect((): void => {
    void fetchDetail();
  }, [fetchDetail]);

  const calculateDifference = (d: ReconciliationDetailDto) => {
    const totalTransaction =
      d.cashTransactionLinks?.reduce((sum, tx) => {
        return sum + Number(tx.amount ?? 0);
      }, 0) ?? 0;

    const totalEntry =
      d.reconcilableEntryLinks?.reduce((sum, entry) => {
        return sum + Number(entry.amount ?? 0);
      }, 0) ?? 0;

    return (totalTransaction - totalEntry).toFixed(2);
  };

  const getAmountColor = (amountString: string) => {
    const amount = parseFloat(amountString);
    if (amount > 0) {
      return "green";
    }
    if (amount < 0) {
      return "red";
    }
    return "inherit";
  };

  // 依分頁建欄
  const modalColumns = useMemo(() => {
    return [
      {
        title: "日期",
        dataIndex: activeTab === "cash" ? "transactionDate" : "entryDate",
      },
      { title: "單號", dataIndex: "referenceNumber" },
      { title: "金額", dataIndex: "entryAmount", align: "right" as const },
      {
        title: "剩餘金額",
        dataIndex: "remainingAmount",
        align: "right" as const,
      },
      { title: "備註", dataIndex: "note" },
    ];
  }, [activeTab]);

  // ✅ 新增：只要 DTO 裡任一欄位顯示「已完成/鎖定」，就視為唯讀
  const isReadOnly: boolean = useMemo(() => {
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

  // ✅ 新增：平帳才允許「完成對沖」
  const diffString: string = detail ? calculateDifference(detail) : "0.00";
  const isBalanced: boolean =
    Number.isFinite(parseFloat(diffString)) &&
    parseFloat(diffString) === 0;

  // 開啟 Modal 時載入資料（cash 分頁→未沖帳務；entries 分頁→未沖金流(分頁)）
  const fetchModalData = async (p: number, ps: number) => {
    if (!id) {
      return;
    }
    setModalLoading(true);
    try {
      if (activeTab === "cash") {
        // 新增「金流」：以 ReconciliationId 分頁抓未沖金流
        const res = await getUnreconciledCashTransactionsByReconciliationId(id, {
          page: p,
          pageSize: ps,
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
            };
          })
        );
        setModalTotal(res.totalCount);
        setModalPage(res.page);
        setModalPageSize(res.pageSize);
      } else {
        // 新增「帳務」：一次性抓未沖帳務（不分頁）
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
            };
          })
        );
        setModalTotal(candidates.length);
        setModalPage(1);
        setModalPageSize(ps); // 維持目前 pageSize 設定
      }
    } catch (error) {
      console.error(error);
      message.error("載入候選資料失敗");
      setModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!id || !detail) {
      return;
    }
    // 每次開啟重置到第 1 頁
    setModalPage(1);
    setModalPageSize(20);
    setModalOpen(true);
    await fetchModalData(1, 20);
  };

  const handleModalPageChange = async (p: number, ps: number) => {
    // 換 pageSize 常見做法回到第 1 頁
    const nextPage = ps !== modalPageSize ? 1 : p;
    setModalPage(nextPage);
    setModalPageSize(ps);
    await fetchModalData(nextPage, ps);
  };

  const handleSubmit = async (selectedItems: SelectedReconciliationItem[]) => {
    if (!id) {
      return;
    }
    setModalLoading(true);
    try {
      for (const item of selectedItems) {
        if (activeTab === "cash") {
          // 現在位於「已連結的金流」分頁：要新增【帳務】到沖銷單
          await createReconciliationCashTransaction(id, {
            cashtransactionid: item.id,
          });
        } else {
          // 現在位於「已連結的帳務」分頁：要新增【金流】到沖銷單
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
  };

  // ✅ 新增：完成對沖
  const handleComplete = async (): Promise<void> => {
    if (!id) {
      return;
    }
    setCompleting(true);
    try {
      await completeReconciliation(id);
      message.success("已完成對沖，畫面鎖定");
      await fetchDetail();
    } catch {
      message.error("完成對沖失敗");
    } finally {
      setCompleting(false);
    }
  };

  if (loading || !detail) {
    return <Spin />;
  }

  return (
    <PageContainer title="沖帳單明細" content={false}>
      <Card style={{ marginBottom: 24 }}>
        <ProForm
          initialValues={{
            referenceNumber: detail.referenceNumber,
            note: detail.note,
          }}
          readonly={isReadOnly} // ✅ 完成後表單唯讀
          onFinish={async (values) => {
            try {
              await updateReconciliation(id!, {
                referenceNumber: values.referenceNumber,
                note: values.note,
              });
              message.success("更新成功");
            } catch (error) {
              console.error(error);
              message.error("更新失敗");
            }
          }}
          submitter={
            isReadOnly
              ? false // ✅ 完成後不顯示「儲存」鈕
              : {
                  searchConfig: { submitText: "儲存" },
                  resetButtonProps: false,
                }
          }
        >
          <ProFormText
            name="referenceNumber"
            label={tReconciliation("fields.referenceNumber.label")}
            width={300}
          />
          <ProFormTextArea
            name="note"
            label={tReconciliation("fields.note.label")}
            fieldProps={{ autoSize: true }}
          />
        </ProForm>
      </Card>

      <Card>
        {/* ✅ 狀態列 + 完成對沖按鈕 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {isReadOnly ? (
              <Tag color="default">已鎖定</Tag>
            ) : isBalanced ? (
              <Tag color="green">可完成（平帳）</Tag>
            ) : (
              <Tag color="red">未平帳</Tag>
            )}
            <span>
              差額：
              <span style={{ color: getAmountColor(diffString) }}>
                {diffString} 元（
                {parseFloat(diffString) > 0
                  ? "多收"
                  : parseFloat(diffString) < 0
                  ? "少收"
                  : "平帳"}
                ）
              </span>
            </span>
          </div>

          <Tooltip
            title={
              isReadOnly
                ? "此沖帳單已完成對沖並鎖定"
                : isBalanced
                ? "完成後將鎖定此沖帳單，無法再新增、編輯或刪除"
                : "差額未為 0，無法完成對沖"
            }
          >
            <Popconfirm
              title="完成對沖後將鎖定，無法再新增、編輯或刪除。是否繼續？"
              onConfirm={handleComplete}
              okText="完成對沖"
              cancelText="取消"
              disabled={isReadOnly || !isBalanced}
            >
              <Button
                type="primary"
                danger
                loading={completing}
                disabled={isReadOnly || !isBalanced}
              >
                完成對沖
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>

        {/* ✅ 鎖定遮罩：完成後禁止任何操作（新增/編輯/刪除） */}
        <div style={{ position: "relative" }}>
          {isReadOnly && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(1px)",
                zIndex: 1,
                borderRadius: 8,
              }}
            />
          )}

          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key as "cash" | "entries");
            }}
          >
            <Tabs.TabPane key="cash" tab="已連結的金流紀錄">
              <ReconciliationCashTransactionList
                reconciliationId={detail.id}
                transactions={detail.cashTransactionLinks}
                onChanged={fetchDetail}
              />
            </Tabs.TabPane>
            <Tabs.TabPane key="entries" tab="已連結的帳務紀錄">
              <ReconciliationReconcilableEntryList
                reconciliationId={detail.id}
                entries={detail.reconcilableEntryLinks}
                onChanged={fetchDetail}
              />
            </Tabs.TabPane>
          </Tabs>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            <Button type="primary" onClick={handleAdd} disabled={isReadOnly}>
              {activeTab === "cash" ? "新增金流紀錄" : "新增帳務紀錄"}
            </Button>
          </div>

          <Divider />

          <Descriptions title="目前沖帳差額" column={1}>
            <Descriptions.Item label="差額">
              <span style={{ color: getAmountColor(diffString) }}>
                {diffString} 元（
                {parseFloat(diffString) > 0
                  ? "多收"
                  : parseFloat(diffString) < 0
                  ? "少收"
                  : "平帳"}
                ）
              </span>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>

      <SelectableListModal<SelectableReconciliationItem>
        open={modalOpen}
        onOpenChange={setModalOpen}
        loading={modalLoading}
        dataSource={modalItems}
        rowKey={(x) => x.id}
        columns={modalColumns}
        title={activeTab === "cash" ? "選擇未沖金流" : "選擇未沖帳務"}
        // ✅ 分頁（entries 分頁使用遠端分頁；cash 分頁則只是顯示單頁）
        page={modalPage}
        pageSize={modalPageSize}
        total={modalTotal}
        onPageChange={handleModalPageChange}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default ReconciliationDetailPage;
