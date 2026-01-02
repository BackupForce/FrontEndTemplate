// src/pages/cash-transactions/cashTransactionColumns.tsx
import type { ProColumns } from "@ant-design/pro-components";
import type { CashTransactionItem } from "@/features/accounts/cash-transaction/types/dto";
import { tCashTrans } from "@/shared/i18n/helpers";

export const searchColumns: ProColumns<CashTransactionItem>[] = [
  {
    title: tCashTrans("fields.transactionDate.label"),
    dataIndex: "transactionDate",
    key: "search-transactionDate", // ✅ 加這行避免 key 衝突
    valueType: "date",
    search: true,
    hideInTable: true,
  },
];


export const tableColumns: ProColumns<CashTransactionItem>[] = [
  {
    title: tCashTrans("fields.transactionDate.label"),
    dataIndex: "transactionDate",
    valueType: "date",
  },
  {
    title: tCashTrans("fields.amount.label"),
    dataIndex: "amount",
    valueType: "money",
  },
  {
    title: tCashTrans("fields.direction.label"),
    dataIndex: "direction",
    valueEnum: {
      0: { text: tCashTrans("enums.direction.in"), status: "Success" },
      1: { text: tCashTrans("enums.direction.out"), status: "Error" },
    },
  },
  {
    title: tCashTrans("fields.financialAccountName.label"),
    dataIndex: "financialAccountName",
  },
  {
    title: tCashTrans("fields.referenceNumber.label"),
    dataIndex: "referenceNumber",
  },
  {
    title: tCashTrans("fields.note.label"),
    dataIndex: "note",
  },
];
