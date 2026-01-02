// features/credit/credit-case/components/forms/creditCaseColumns.tsx
import type { ProColumns } from "@ant-design/pro-components";
import type { CreditCaseDto } from "@/features/credit/credit-case/types/dto";
import { Tag } from "antd";

/**
 * 狀態顯示（避免 enum，保持 erasableSyntaxOnly 友善）
 * 0: Open, 1: Approved, 2: Rejected, 3: Closed
 */
const statusValueEnum: Record<number, { text: string }> = {
  0: { text: "Open" },
  1: { text: "Approved" },
  2: { text: "Rejected" },
  3: { text: "Closed" },
};

const renderStatus = (status: number) => {
  switch (status) {
    case 0:
      return <Tag color="processing">Open</Tag>;
    case 1:
      return <Tag color="success">Approved</Tag>;
    case 2:
      return <Tag color="error">Rejected</Tag>;
    case 3:
      return <Tag>Closed</Tag>;
    default:
      return <Tag>Unknown</Tag>;
  }
};

/**
 * 搜尋欄位
 * - 對應後端 /credit-cases 查詢條件：partnerId / financialAccountId / status
 * - 若你要支援關鍵字或日期區間，可再加欄位並在 request 端轉成對應參數
 */
export const searchColumns: ProColumns<CreditCaseDto>[] = [
  // 夥伴（以 Id 為主；若你有 RemotePartnerSelect，可在外層 form item 套用）
  {
    title: "夥伴",
    dataIndex: "partnerId",
    hideInTable: true,
    colSize: 2,
  },
  // 帳戶（以 Id 為主）
  {
    title: "金流帳戶",
    dataIndex: "financialAccountId",
    hideInTable: true,
    colSize: 2,
  },
  // 狀態
  {
    title: "狀態",
    dataIndex: "status",
    hideInTable: true,
    colSize: 1,
    valueType: "select",
    valueEnum: statusValueEnum,
  },
];

/**
 * 清單欄位
 * - 金額以 toLocaleString 顯示（Exposure/CreditLimit/TriggerAmount）
 * - 狀態以 Tag 呈現
 * - 可依實際資料源補上 PartnerName / CompanyName 等顯示欄位
 */
export const tableColumns: ProColumns<CreditCaseDto>[] = [
  {
    title: "來源類型",
    dataIndex: "triggerSourceType",
    hideInSearch: true,
    width: 160,
  },
  {
    title: "來源單號",
    dataIndex: "triggerSourceId",
    hideInSearch: true,
    ellipsis: true,
    width: 220,
  },
  {
    title: "暴露額",
    dataIndex: "exposure",
    hideInSearch: true,
    width: 140,
    render: (_, r) =>
      Number(r.exposure).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    title: "信用額度",
    dataIndex: "creditLimit",
    hideInSearch: true,
    width: 140,
    render: (_, r) =>
      Number(r.creditLimit).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    title: "來源金額",
    dataIndex: "triggerAmount",
    hideInSearch: true,
    width: 140,
    render: (_, r) =>
      Number(r.triggerAmount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    title: "狀態",
    dataIndex: "status",
    hideInSearch: true,
    width: 140,
    render: (_, r) => renderStatus(r.status as unknown as number),
  },
  {
    title: "CompanyId",
    dataIndex: "companyId",
    hideInSearch: true,
    width: 220,
    ellipsis: true,
  },
  {
    title: "PartnerId",
    dataIndex: "partnerId",
    hideInSearch: true,
    width: 220,
    ellipsis: true,
  },
];
