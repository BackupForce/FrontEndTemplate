import type { FC } from "react";
import { useState } from "react";
import { Button, Popconfirm, Space, Table, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ReconcilableEntryLinkDto } from "@/features/accounts/reconciliation/types/dto";
import { dateColumn, COL_WIDTH } from "@/shared/ui/columns/columnPresets";
import EditReconciliationLinkAmountModal from "../modals/EditReconciliationLinkAmountModal";
import {
  updateReconciliationReconcilableEntry,
  deleteReconciliationReconcilableEntry,
} from "@/features/accounts/reconciliation/api/reconciliation-reconcilable-entry.api";
import { normalizeDirection, signedAmount } from "@/features/accounts/reconciliation/utils/direction";

interface Props {
  /** 沖帳單 Id（用於呼叫連結更新/刪除 API） */
  reconciliationId: string;
  /** 表格資料：已連結的帳務紀錄 */
  entries: ReconcilableEntryLinkDto[];
  /** 異動成功後呼叫以刷新父頁（通常傳入 fetchDetail） */
  onChanged: () => Promise<void> | void;
  /** 唯讀模式（完成沖帳後或無權限時） */
  readOnly?: boolean;
}

/**
 * 已連結的帳務紀錄清單（支援 編輯金額、刪除連結；唯讀時隱藏操作）
 * - 編輯：只改「連結上的沖帳金額」(link.amount)
 * - 刪除：刪除該筆帳務與沖帳單的連結
 */
const ReconciliationReconcilableEntryList: FC<Props> = ({
  reconciliationId,
  entries,
  onChanged,
  readOnly = false,
}) => {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [editing, setEditing] = useState<ReconcilableEntryLinkDto | null>(null);

  const { message } = App.useApp();

  const openEditModal = (record: ReconcilableEntryLinkDto): void => {
    if (readOnly) {
      return;
    }
    setEditing(record);
    setEditOpen(true);
  };

  const handleEditCancel = (): void => {
    setEditOpen(false);
    setEditing(null);
  };

  const handleEditSubmit = async (values: { amount: number }): Promise<void> => {
    if (editing == null) {
      return;
    }
    setSaving(true);
    try {
      // 這裡假設型別有 reconcilableEntryLinkId（通常連結 Id 與主檔 Id 不同）
      await updateReconciliationReconcilableEntry(
        reconciliationId,
        (editing as unknown as { reconcilableEntryLinkId: string }).reconcilableEntryLinkId,
        { amount: values.amount }
      );
      message.success("更新成功");
      setEditOpen(false);
      setEditing(null);
      await onChanged();
    } catch {
      message.error("更新失敗");
    } finally {
      setSaving(false);
    }
  };

  const baseColumns: ColumnsType<ReconcilableEntryLinkDto> = [
    dateColumn<ReconcilableEntryLinkDto>("dueDate", "入帳日"),
    {
      title: "原始金額",
      dataIndex: "originalAmount",
      width: COL_WIDTH.money,
      align: "right",
      render: (value: number, record: ReconcilableEntryLinkDto) => {
        const dir = normalizeDirection(record.direction);
        const signed = signedAmount(Number(value ?? 0), dir);
        const color = signed < 0 ? "red" : undefined;
        return <span style={{ color }}>{signed.toFixed(2)}</span>;
      },
    },
    { title: "沖帳金額", dataIndex: "amount", width: COL_WIDTH.money, align: "right" },
    { title: "剩餘金額", dataIndex: "remainingAmount", width: COL_WIDTH.money, align: "right" },
    { title: "分錄類型", dataIndex: "entryType" },
    { title: "對象", dataIndex: "partnerName" },
    { title: "幣別", dataIndex: "currencyCode", width: 90 },
  ];

  const actionColumn = {
    title: "操作",
    width: 200,
    render: (_: unknown, record: ReconcilableEntryLinkDto) => {
      if (readOnly) {
        return null; // 唯讀時不顯示操作
      }
      return (
        <Space>
          <Button type="link" onClick={() => { openEditModal(record); }}>
            編輯金額
          </Button>
          <Popconfirm
            title="確定刪除這筆帳務紀錄？"
            onConfirm={async () => {
              try {
                await deleteReconciliationReconcilableEntry(
                  reconciliationId,
                  (record as unknown as { reconcilableEntryLinkId: string }).reconcilableEntryLinkId
                );
                message.success("刪除成功");
                await onChanged();
              } catch {
                message.error("刪除失敗");
              }
            }}
          >
            <Button danger>刪除</Button>
          </Popconfirm>
        </Space>
      );
    },
  } as const;

  // 唯讀時移除操作欄；否則加入
  const columns: ColumnsType<ReconcilableEntryLinkDto> = readOnly
    ? baseColumns
    : [...baseColumns, actionColumn];

  // 可能存在 referenceNumber 欄位；若沒有就顯示為空
  const editingRefNo: string | null =
    (editing as unknown as { referenceNumber?: string | null })?.referenceNumber ?? null;

  return (
    <>
      <Table<ReconcilableEntryLinkDto>
        rowKey="reconcilableEntryId"
        columns={columns}
        dataSource={entries}
        pagination={false}
      />

      {/* Modal：唯讀時不會被打開，但保留無礙 */}
      <EditReconciliationLinkAmountModal
        open={editOpen}
        onCancel={handleEditCancel}
        onSubmit={handleEditSubmit}   // 只會收到 { amount }
        confirmLoading={saving}
        initialAmount={editing?.amount ?? 0}
        // 帳務列表只編輯金額，不顯示備註
        showNote={false}
        currencyCode={editing?.currencyCode}
        referenceNumber={editingRefNo}
        title="編輯沖帳金額"
      />
    </>
  );
};

export default ReconciliationReconcilableEntryList;
