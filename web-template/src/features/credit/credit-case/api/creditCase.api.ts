// features/credit/credit-case/apis/creditCase.api.ts
import axios from "@/core/http/axiosInstance";
import type { PagedResult } from "@/core/types/paged-result";
import type {
  CreditCaseDto,
  CreditCaseDetailDto,
  CreateManualCreditCaseRequest,
  ApproveCreditCaseRequest,
  CCListQuery
} from "@/features/credit/credit-case/types/dto";

/**
 * 建議的 CCListQuery 欄位（請依你的後端實際接受的條件對齊 types/dto）：
 * page: number;
 * pageSize: number;
 * keyword?: string;
 * partnerId?: string;
 * financialAccountId?: string;
 * status?: number; // enum 以 number 傳
 * createdFrom?: string; // YYYY-MM-DD
 * createdTo?: string;   // YYYY-MM-DD
 */

export const creditCaseApi = {
  /** 手動建立 CreditCase（POST /credit-cases/manual） */
  createManual: async (input: CreateManualCreditCaseRequest): Promise<void> => {
    await axios.post("/credit-cases/manual", input);
  },

  /** 審核通過（POST /credit-cases/{id}/approve） */
  approve: async (id: string, input: ApproveCreditCaseRequest): Promise<void> => {
    await axios.post(`/credit-cases/${id}/approve`, input);
  },

  /** 取得 CreditCase 清單（GET /credit-cases） */
  list: async (q: CCListQuery): Promise<PagedResult<CreditCaseDto>> => {
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
    if (q.financialAccountId) {
      params.financialAccountId = q.financialAccountId;
    }
    if (typeof q.status === "number") {
      params.status = q.status; // 對齊後端用數字 enum
    }
    if (q.createdFrom) {
      params.createdFrom = q.createdFrom; // 建議 YYYY-MM-DD
    }
    if (q.createdTo) {
      params.createdTo = q.createdTo; // 建議 YYYY-MM-DD
    }

    const res = await axios.get<PagedResult<CreditCaseDto>>("/credit-cases", {
      params
    });
    return res.data;
  },

  /** 依 Id 取得明細（GET /credit-cases/{id}） */
  getById: async (id: string): Promise<CreditCaseDetailDto> => {
    const res = await axios.get<CreditCaseDetailDto>(`/credit-cases/${id}`);
    return res.data;
  }
};
