// features/sales/sales-record/components/forms/salesRecordColumns.tsx
import type { ProColumns } from "@ant-design/pro-components";
import type { SalesRecordDto } from "@/features/sales/sales-record/types/dto";
import { Tag } from "antd";

/**
 * 狀態顯示（避免 enum，保持 erasableSyntaxOnly 友善）
 */
const statusValueEnum: Record<number, { text: string }> = {
  0: { text: "Draft" },
  1: { text: "PendingCredit" },
  2: { text: "Approved" },
  3: { text: "Blocked" },
};

const renderStatus = (status: number) => {
  switch (status) {
    case 0:
      return <Tag>Draft</Tag>;
    case 1:
      return <Tag color="processing">PendingCredit</Tag>;
    case 2:
      return <Tag color="success">Approved</Tag>;
    case 3:
      return <Tag color="error">Blocked</Tag>;
    default:
      return <Tag>Unknown</Tag>;
  }
};

/**
 * 搜尋欄位
 * - 以 PartnerName / Status / PostingDate（date range）為主
 * - 與樣板一致使用 top-level 常數避免 SWC/TS 限制
 */
export const searchColumns: ProColumns<SalesRecordDto>[] = [
  // 夥伴名稱（關鍵字）
  {
    title: "夥伴名稱",
    dataIndex: "partnerName",
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
  // 過帳日期（區間）
  {
    title: "過帳日期",
    dataIndex: "postingDate",
    hideInTable: true,
    colSize: 2,
    valueType: "dateRange",
    // 提醒：你的 request 端要把 dateRange 轉成 postingFrom/postingTo 再丟給 API
  },
];

/**
 * 清單欄位
 * - 金額使用 toLocaleString 顯示
 * - 狀態以 Tag 呈現
 */
export const tableColumns: ProColumns<SalesRecordDto>[] = [
  {
    title: "過帳日期",
    dataIndex: "postingDate",
    hideInSearch: true,
    valueType: "date",
    width: 120,
  },
  {
    title: "夥伴名稱",
    dataIndex: "partnerName",
    hideInSearch: true,
    width: 200,
  },
  {
    title: "幣別",
    dataIndex: "currencyCode",
    hideInSearch: true,
    width: 80,
  },
  {
    title: "金額",
    dataIndex: "amount",
    hideInSearch: true,
    width: 140,
    render: (_, record) =>
      Number(record.amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    title: "狀態",
    dataIndex: "status",
    hideInSearch: true,
    width: 140,
    render: (_, r) => renderStatus(r.status),
  },
  {
    title: "備註",
    dataIndex: "note",
    hideInSearch: true,
    ellipsis: true,
  },
];
