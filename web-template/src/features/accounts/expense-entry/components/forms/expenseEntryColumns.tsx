import type { ProColumns } from "@ant-design/pro-components";
import type { ExpenseEntryDto } from "@/features/accounts/expense-entry/types/dto";
import { tExpenseEntry } from "@/shared/i18n/helpers";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect";
// 如果你已有費用類別的遠端選單，替換為實際元件即可
// import RemoteExpenseCategorySelect from "@/shared/ui/select/RemoteExpenseCategorySelect";

/**
 * 搜尋欄位（與你的 FinancialAccount 搜尋欄位設計一致）：
 * - 關鍵字（描述）
 * - 類別
 * - 狀態
 * - 幣別
 * - 期間（起訖）
 */
export const searchColumns: ProColumns<ExpenseEntryDto>[] = [
  {
    title: tExpenseEntry("fields.keyword.label"),
    dataIndex: "keyword",
    hideInTable: true,
    colSize: 2,
  },
  {
    title: tExpenseEntry("fields.categoryId.label"),
    dataIndex: "categoryId",
    hideInTable: true,
    colSize: 2,
    renderFormItem: (_schema, { type, defaultRender }) => {
      if (type === "form") {
        return defaultRender(_schema);
      }
      // 若你有 RemoteExpenseCategorySelect，改用它
      return defaultRender(_schema);
      // return (
      //   <RemoteExpenseCategorySelect
      //     name="categoryId"
      //     placeholder={tExpenseEntry("placeholders.category")}
      //   />
      // );
    },
  },
  {
    title: tExpenseEntry("fields.status.label"),
    dataIndex: "status",
    hideInTable: true,
    colSize: 1,
    // 如果未來有 enum，可改 valueEnum
    // valueType: "select",
    // valueEnum: { 0: { text: "Pending" }, 1: { text: "Paid" }, 2: { text: "Canceled" } }
  },
  {
    title: tExpenseEntry("fields.originalAmountCurrency.label"),
    dataIndex: "originalAmountCurrency",
    hideInTable: true,
    colSize: 1,
    renderFormItem: (_schema, { type, defaultRender }) => {
      if (type === "form") {
        return defaultRender(_schema);
      }
      return (
        <RemoteCurrencySelect
          name="originalAmountCurrency"
          placeholder={tExpenseEntry("placeholders.currency")}
        />
      );
    },
  },
  {
    title: tExpenseEntry("fields.fromDate.label"),
    dataIndex: "fromDate",
    hideInTable: true,
    colSize: 1,
    valueType: "date",
  },
  {
    title: tExpenseEntry("fields.toDate.label"),
    dataIndex: "toDate",
    hideInTable: true,
    colSize: 1,
    valueType: "date",
  },
];

/**
 * 清單欄位：金額用 toLocaleString 呈現（對齊你的 FinancialAccount 寫法）
 */
export const tableColumns: ProColumns<ExpenseEntryDto>[] = [
  {
    title: tExpenseEntry("fields.entryDate.label"),
    dataIndex: "entryDate",
    hideInSearch: true,
    valueType: "date",
  },
  {
    title: tExpenseEntry("fields.dueDate.label"),
    dataIndex: "dueDate",
    hideInSearch: true,
    valueType: "date",
  },
  {
    title: tExpenseEntry("fields.originalAmountValue.label"),
    dataIndex: "originalAmountValue",
    hideInSearch: true,
    render: (_, record) =>
      Number(record.originalAmountValue).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    title: tExpenseEntry("fields.originalAmountCurrency.label"),
    dataIndex: "originalAmountCurrency",
    hideInSearch: true,
  },
  {
    title: tExpenseEntry("fields.categoryName.label"),
    dataIndex: "categoryName",
    hideInSearch: true,
  },
  {
    title: tExpenseEntry("fields.status.label"),
    dataIndex: "status",
    hideInSearch: true,
    // 之後可換成 Tag 呈現
  },
  {
    title: tExpenseEntry("fields.description.label"),
    dataIndex: "description",
    hideInSearch: true,
  },
];
