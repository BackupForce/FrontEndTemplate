import { Button, Popconfirm, Table, App, Space } from "antd";
import { useState } from "react";
import type { FC } from "react";
import type { ColumnsType } from "antd/es/table";
import type { CashTransactionLinkDto } from "@/features/accounts/reconciliation/types/dto";

import { dateColumn, COL_WIDTH } from "@/shared/ui/columns/columnPresets";
import {
  deleteReconciliationCashTransaction,
  updateReconciliationCashTransaction,
} from "@/features/accounts/reconciliation/api/reconciliation-cash-transaction.api";

import EditReconciliationLinkAmountModal from "../modals/EditReconciliationLinkAmountModal";
import { normalizeDirection, signedAmount } from "@/features/accounts/reconciliation/utils/direction";

interface Props {
  reconciliationId: string;
  transactions: CashTransactionLinkDto[];
  onChanged: () => Promise<void> | void;
  readOnly?: boolean; // ← 可選，缺省 false
}

const ReconciliationCashTransactionList: FC<Props> = ({
  reconciliationId,
  transactions,
  onChanged,
  readOnly = false,
}) => {
  // 編輯金額的狀態
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<CashTransactionLinkDto | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const { message } = App.useApp();

  const openEditModal = (record: CashTransactionLinkDto): void => {
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

  const handleEditSubmit = async (values: { amount: number; note?: string | null }): Promise<void> => {
    if (editing == null) {
      return;
    }
    setSaving(true);
    try {
      await updateReconciliationCashTransaction(reconciliationId, editing.cashTransactionLinkId, {
        amount: values.amount,
        note: values.note ?? undefined,
      });
      message.success("更新成功");
      setEditOpen(false);
      setEditing(null);
      await onChanged();
    } catch (error) {
      message.error("更新失敗");
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const baseColumns: ColumnsType<CashTransactionLinkDto> = [
    dateColumn<CashTransactionLinkDto>("transactionDate", "交易日"),
    {
      title: "原始金額",
      dataIndex: "originalAmount",
      width: COL_WIDTH.money,
      align: "right",
      render: (value: number, record: CashTransactionLinkDto) => {
        const dir = normalizeDirection(record.direction);
        const signed = signedAmount(Number(value ?? 0), dir);
        const color = signed < 0 ? "red" : undefined;
        return <span style={{ color }}>{signed.toFixed(2)}</span>;
      },
    },
    { title: "沖帳金額", dataIndex: "amount", width: COL_WIDTH.money, align: "right" },
    { title: "剩餘金額", dataIndex: "remainingAmount", width: COL_WIDTH.money, align: "right" },
    { title: "金流帳戶", dataIndex: "financialAccountName" },
    { title: "單號", dataIndex: "referenceNumber" },
    { title: "幣別", dataIndex: "currencyCode", width: 90 },
  ];

  const actionColumn = {
    title: "操作",
    width: 180,
    render: (_: unknown, record: CashTransactionLinkDto) => {
      if (readOnly) {
        return null; // ← 唯讀時不顯示任何操作
      }
      return (
        <Space>
          <Button
            type="link"
            onClick={() => {
              openEditModal(record);
            }}
          >
            編輯金額
          </Button>
          <Popconfirm
            title="確定刪除這筆金流紀錄？"
            onConfirm={async () => {
              try {
                await deleteReconciliationCashTransaction(reconciliationId, record.cashTransactionLinkId);
                message.success("刪除成功");
                await onChanged();
              } catch (error) {
                message.error("刪除失敗");
                console.error(error);
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
  const columns: ColumnsType<CashTransactionLinkDto> = readOnly
    ? baseColumns
    : [...baseColumns, actionColumn];

  return (
    <>
      <Table<CashTransactionLinkDto>
        rowKey="cashTransactionId"
        columns={columns}
        dataSource={transactions}
        pagination={false}
      />

      {/* Modal 只有在可操作時才有機會被打開；保留無礙 */}
      <EditReconciliationLinkAmountModal
        open={editOpen}
        onCancel={handleEditCancel}
        onSubmit={handleEditSubmit}
        confirmLoading={saving}
        initialAmount={editing?.amount ?? 0}
        initialNote={editing?.note ?? null}
        currencyCode={editing?.currencyCode}
        referenceNumber={editing?.referenceNumber ?? null}
        title="編輯沖帳金額"
      />
    </>
  );
};

export default ReconciliationCashTransactionList;
