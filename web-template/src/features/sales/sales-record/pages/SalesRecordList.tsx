// features/sales/sales-record/pages/SalesRecordList.tsx
import ProCrudPage from "@/shared/ui/crud/ProCrudPage";
import { Button, message } from "antd";
import type { ProColumns } from "@ant-design/pro-components";

import { useAuth } from "@/shared/auth/useAuth";
import { triggerProCrudReload } from "@/shared/ui/crud/proCrudReload";

import { salesRecordApi } from "@/features/sales/sales-record/api/salesRecord.api";
import type { SalesRecordDto } from "@/features/sales/sales-record/types/dto";
import {
  searchColumns as srSearchColumns,
  tableColumns as srTableColumns,
} from "@/features/sales/sales-record/components/forms/salesRecordColumns";

import SalesRecordCreateModal from "../components/modals/SalesRecordCreateModal";

import { SalesRecordStatus as SRStatusConst } from "@/features/sales/sales-record/types/dto";
import type { SalesRecordStatus as SRStatus } from "@/features/sales/sales-record/types/dto";
import { useTabContext } from "@/app/providers/TabProvider"; // ✅ 發票清單也是用這個開分頁 :contentReference[oaicite:2]{index=2}

const isSalesRecordStatus = (v: unknown): v is SRStatus =>
  v === SRStatusConst.Draft ||
  v === SRStatusConst.PendingCredit ||
  v === SRStatusConst.Approved ||
  v === SRStatusConst.Blocked;

/** 專屬 Confirm 動作欄位（僅 Draft 可按） */
const confirmColumn: ProColumns<SalesRecordDto> = {
  title: "授信",
  valueType: "option",
  width: 120,
  render: (_, record) => {
    const isDraft = record.status === 0; // 0 = Draft
    return (
      <Button
        type="link"
        disabled={!isDraft}
        onClick={async () => {
          try {
            await salesRecordApi.confirm(record.id);
            message.success("確認成功");
            triggerProCrudReload(); // 觸發列表刷新
          } catch (err) {
            message.error("確認失敗");
            console.log(err);
          }
        }}
      >
        Confirm
      </Button>
    );
  },
};

/** 明細連結欄位：用 openTab 開啟 SR 詳情分頁（與 InvoiceList 相同手法） */
function useDetailColumn(): ProColumns<SalesRecordDto> {
  const { openTab } = useTabContext();
  return {
    title: "明細",
    valueType: "option",
    width: 100,
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => openTab(`/sales-records/${record.id}`, "銷貨明細")}
      >
        查看
      </Button>
    ),
  };
}

export default function SalesRecordList() {
  const { hasPermission } = useAuth();
  const detailColumn = useDetailColumn();

  // 把 Confirm + 明細欄位加到清單尾端
  const columns: ProColumns<SalesRecordDto>[] = [...srTableColumns, confirmColumn, detailColumn];

  return (
    <ProCrudPage<SalesRecordDto, string>
      title="銷貨紀錄"
      rowKey={(x) => x.id}
      columns={columns}
      searchColumns={srSearchColumns}
      /** 分頁查詢（把 ProTable params 轉為 API 參數） */
      fetch={async (params) => {
        const page = typeof params.current === "number" ? params.current : 1;
        const pageSize = typeof params.pageSize === "number" ? params.pageSize : 10;

        // 關鍵字：以 PartnerName 搜尋
        const keyword =
          typeof params.PartnerName === "string" && params.PartnerName.trim().length > 0
            ? params.PartnerName.trim()
            : undefined;

        // 狀態：數字枚舉（0|1|2|3）
        const status: SRStatus | undefined = isSalesRecordStatus(params.Status)
          ? params.Status
          : undefined;

        // 日期區間：PostingDate 是 dateRange，轉 postingFrom/To (YYYY-MM-DD)
        let postingFrom: string | undefined;
        let postingTo: string | undefined;
        const dateRange = params.PostingDate as unknown;
        if (Array.isArray(dateRange) && dateRange.length === 2) {
          const fmt = (v: unknown) =>
            typeof v === "string"
              ? v
              : (v as { format?: (s: string) => string })?.format?.("YYYY-MM-DD") ?? undefined;
          postingFrom = fmt(dateRange[0]);
          postingTo = fmt(dateRange[1]);
        }

        const res = await salesRecordApi.list({
          page,
          pageSize,
          keyword,
          status,
          postingFrom,
          postingTo,
        });

        return { data: res.items, total: res.totalCount };
      }}
      /** 刪除（僅提供刪除與 Confirm，不提供新增/編輯） */
      onRemove={async (id) => {
        await salesRecordApi.remove(id);
      }}
      CreateModal={SalesRecordCreateModal}
      /** 權限控制 */
      canCreate={() => hasPermission("sales-record:create")}
      canEdit={() => false}
      canDelete={() => hasPermission("sales-record:delete")}
      texts={{
        remove: "刪除",
        removeConfirm: "確定要刪除這筆銷貨紀錄嗎？",
        removeSuccess: "刪除成功",
      }}
    />
  );
}
