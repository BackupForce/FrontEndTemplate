import { tPayable } from "@/shared/i18n/helpers";
import type { ProColumns } from "@ant-design/pro-components";
import RemotePartnerSelect from "@/shared/ui/select/RemotePartnerSelect";

const valueEnum = {
  0: { text: tPayable("status.unreconciled") },
  1: { text: tPayable("status.partially_reconciled") },
  2: { text: tPayable("status.reconciled") },
};

/**
 * 建立搜尋欄位，避免因 top-level JSX + const 被 ts/swc 擋下
 */
export const searchColumns: ProColumns[] = [
  // ✅ 搜尋欄位：開立日期範圍
  {
    title: tPayable("fields.issueDate.label"),
    dataIndex: "issueDateRange",
    valueType: "dateRange",
    hideInTable: true,
    colSize: 3,
    search: {
      transform: (value) => ({
        issueDateFrom: value?.[0],
        issueDateTo: value?.[1],
      }),
    },
  },
  // ✅ 搜尋欄位：供應商
  {
    title: tPayable("fields.supplierName.label"),
    dataIndex: "supplierId",
    hideInTable: true,
    colSize: 2,
    renderFormItem: () => (
      <RemotePartnerSelect
        name="supplierId"
        label={tPayable("fields.supplierName.label")}
        onlySupplier
        hideLabel
      />
    ),
  },
  // ✅ 搜尋欄位：狀態
  {
    title: tPayable("fields.status.label"),
    dataIndex: "status",
    valueType: "select",
    hideInTable: true,
    colSize: 1,
    valueEnum,
  },
];

export const tableColumns: ProColumns[] = [
  {
    title: tPayable("fields.billNumber.label"),
    dataIndex: "billNumber",
    hideInSearch: true,
  },
  {
    title: tPayable("fields.issueDate.label"),
    dataIndex: "issueDate",
    valueType: "date",
    hideInTable: false,
    hideInSearch: true,
  },
  {
    title: tPayable("fields.dueDate.label"),
    dataIndex: "dueDate",
    valueType: "date",
    hideInTable: false,
    hideInSearch: true,
  },
  {
    title: tPayable("fields.originalAmountValue.label"),
    dataIndex: "originalAmountValue",
    hideInSearch: true,
    render: (_, record) =>
      record.originalAmountValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    title: tPayable("fields.originalAmountCurrency.label"),
    hideInSearch: true,
    dataIndex: "originalAmountCurrency",
  },
  {
    title: tPayable("fields.status.label"),
    dataIndex: "status",
    hideInSearch: true,
    valueEnum,
  },
  {
    title: tPayable("fields.supplierName.label"),
    hideInSearch: true,
    dataIndex: "supplierName",
  },
];
