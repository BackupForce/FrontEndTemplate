// features/finance/cash/financial-account/components/forms/financialAccountColumns.tsx
import type { ProColumns } from "@ant-design/pro-components";
import type { FinancialAccountDto } from "@/features/accounts/financial-account/types/dto";
import { tFinancialAccount } from "@/shared/i18n/helpers";
import RemoteCurrencySelect from "@/shared/ui/select/RemoteCurrencySelect"
/**
 * 建立搜尋欄位：與 Payable 的寫法一致，採用 top-level 常數避免 swc/ts 限制
 * 目前後端未提供明確的查詢參數，但先保留常用查詢欄位（name/type/currencyId）
 * 之後若後端加入查詢條件，前端只需將搜尋參數轉換傳入 request 即可
 */
export const searchColumns: ProColumns<FinancialAccountDto>[] = [
  // ✅ 搜尋欄位：帳戶名稱
  {
    title: tFinancialAccount("fields.name.label"),
    dataIndex: "name",
    hideInTable: true,
    colSize: 2,
  },
  // ✅ 搜尋欄位：帳戶類型
  {
    title: tFinancialAccount("fields.type.label"),
    dataIndex: "type",
    hideInTable: true,
    colSize: 2,
    // 若未來有 enum，可把 valueType 換成 'select' 並提供 valueEnum
    // valueType: "select",
    // valueEnum: { bank: { text: "Bank" }, cash: { text: "Cash" }, digital: { text: "Digital" } }
  },
  // ✅ 搜尋欄位：幣別
  {
    //title: tFinancialAccount("fields.currencyId.label"),
    dataIndex: "currencyId",
    hideInTable: true,
    colSize: 1,
    renderFormItem: (_schema, { type, defaultRender }) => {
      // 只在「搜尋表單」用自訂的 RemoteCurrencySelect，其它地方（例如編輯表單）用預設
      if (type === "form") {
        return defaultRender(_schema);
      }
      return (
        <RemoteCurrencySelect
          name="currencyId"
          placeholder={tFinancialAccount("placeholders.currency")}
          // rules、showSearch 之類的你的元件裡已經內建了
        />
      );
    },
  },
];

/**
 * 清單欄位：與 Payable 的呈現風格一致，金額使用 toLocaleString 顯示
 */
export const tableColumns: ProColumns<FinancialAccountDto>[] = [
  {
    title: tFinancialAccount("fields.name.label"),
    dataIndex: "name",
    hideInSearch: true,
  },
  {
    title: tFinancialAccount("fields.type.label"),
    dataIndex: "type",
    hideInSearch: true,
  },
  {
    title: tFinancialAccount("fields.bankName.label"),
    dataIndex: "bankName",
    hideInSearch: true,
  },
  {
    title: tFinancialAccount("fields.accountNumber.label"),
    dataIndex: "accountNumber",
    hideInSearch: true,
  },
  {
    title: tFinancialAccount("fields.balance.label"),
    dataIndex: "balance",
    hideInSearch: true,
    render: (_, record) =>
      record.balance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    title: tFinancialAccount("fields.currencyId.label"),
    dataIndex: "currencyId",
    hideInSearch: true,
  },
  {
    title: tFinancialAccount("fields.note.label"),
    dataIndex: "note",
    hideInSearch: true,
  },
];
