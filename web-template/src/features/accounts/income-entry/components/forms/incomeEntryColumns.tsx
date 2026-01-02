import type { ProColumns } from "@ant-design/pro-components";
import { tIncome } from "@/shared/i18n/helpers";
//import RemoteCategorySelect from "@/components/form-fields/RemoteCategorySelect";

const valueEnum = {
  0: { text: tIncome("status.unreconciled") },
  1: { text: tIncome("status.partially_reconciled") },
  2: { text: tIncome("status.reconciled") },
};

/**
 * 建立搜尋欄位：入帳日區間、分類、狀態
 */
export const searchColumns: ProColumns[] = [
  {
    title: tIncome("fields.entryDate.label"),
    dataIndex: "entryDateRange",
    valueType: "dateRange",
    hideInTable: true,
    colSize: 3,
    search: {
      transform: (value) => ({
        entryDateFrom: value?.[0],
        entryDateTo: value?.[1],
      }),
    },
  },
//   {
//     title: tIncome("fields.category.label"),
//     dataIndex: "categoryId",
//     hideInTable: true,
//     colSize: 2,
//     renderFormItem: () => (
//       <RemoteCategorySelect
//         name="categoryId"
//         label={tIncome("fields.category.label")}
//         hideLabel
//       />
//     ),
//   },
  {
    title: tIncome("fields.status.label"),
    dataIndex: "status",
    valueType: "select",
    hideInTable: true,
    colSize: 1,
    valueEnum,
  },
];

/**
 * 表格欄位：入帳日、到期日、金額、幣別、分類、說明、狀態
 */
export const tableColumns: ProColumns[] = [
  {
    title: tIncome("fields.entryDate.label"),
    dataIndex: "entryDate",
    valueType: "date",
    hideInSearch: true,
  },
  {
    title: tIncome("fields.dueDate.label"),
    dataIndex: "dueDate",
    valueType: "date",
    hideInSearch: true,
  },
  {
    title: tIncome("fields.originalAmountValue.label"),
    dataIndex: "originalAmountValue",
    hideInSearch: true,
    render: (_, record) =>
      record.originalAmountValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    title: tIncome("fields.originalAmountCurrency.label"),
    dataIndex: "originalAmountCurrency",
    hideInSearch: true,
  },
  {
    title: tIncome("fields.category.label"),
    dataIndex: "categoryName",
    hideInSearch: true,
  },
  {
    title: tIncome("fields.description.label"),
    dataIndex: "description",
    ellipsis: true,
    hideInSearch: true,
  },
  {
    title: tIncome("fields.status.label"),
    dataIndex: "status",
    valueEnum,
    hideInSearch: true,
  },
];
