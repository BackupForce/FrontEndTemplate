// features/sales/sales-record/apis/salesRecord.api.ts
import axios from "@/core/http/axiosInstance";
import type {
  SalesRecordDto,
  SalesRecordDetailDto,
  CreateSalesRecordRequest,
  SRListQuery
} from "@/features/sales/sales-record/types/dto";
import type { PagedResult } from "@/core/types/paged-result";

export const salesRecordApi = {
  /** 建立 SalesRecord */
  create: async (input: CreateSalesRecordRequest): Promise<void> => {
    await axios.post("/sales-records", input);
  },

  /** 刪除 SalesRecord */
  remove: async (id: string): Promise<void> => {
    await axios.delete(`/sales-records/${id}`);
  },

  /** 授信確認（Confirm） */
  confirm: async (id: string): Promise<void> => {
    await axios.post(`/sales-records/${id}/confirm`);
  },

  /** 取得 SalesRecord 清單（分頁） */
  list: async (q: SRListQuery): Promise<PagedResult<SalesRecordDto>> => {
    const params: Record<string, unknown> = {
      page: q.page,
      pageSize: q.pageSize
    };

    if (q.keyword) {
      params.keyword = q.keyword;
    }
    if (q.partnerId) {
      params.partnerId = q.partnerId;
    }
    if (typeof q.status === "number") {
      params.status = q.status;
    }
    if (q.postingFrom) {
      params.postingFrom = q.postingFrom; // 建議 YYYY-MM-DD
    }
    if (q.postingTo) {
      params.postingTo = q.postingTo; // 建議 YYYY-MM-DD
    }

    const res = await axios.get<PagedResult<SalesRecordDto>>("/sales-records", {
      params
    });
    return res.data;
  },

  /** 依 Id 取得 SalesRecord 明細 */
  // getById: async (id: string): Promise<SalesRecordDetailDto> => {
  //   const res = await axios.get<SalesRecordDetailDto>(`/sales-records/${id}`);
  //   return res.data;
  // },
  /**
   * 依 Id 取得銷貨紀錄詳情（含明細）
   * GET /sales-records/{id}
   */
  async getDetail(id: string): Promise<SalesRecordDetailDto> {
    const url: string = `/sales-records/${id}`;
    const response = await axios.get<SalesRecordDetailDto>(url);
    return response.data;
  },
};
