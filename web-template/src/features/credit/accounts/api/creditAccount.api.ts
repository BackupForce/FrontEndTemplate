import axios from "@/core/http/axiosInstance";
import type { PartnerCreditSummaryDto } from "@/features/crm/partner/types/dto";
import type { PartnerCreditAdjustmentDto } from "@/features/credit/accounts/types/dto";
import type { PagedResult } from "@/core/types/paged-result";

export const creditAccountApi = {
  /** 取得 Partner 的 Credit 摘要 */
  getSummary: async (partnerId: string): Promise<PartnerCreditSummaryDto> => {
    const { data } = await axios.get<PartnerCreditSummaryDto>(`/credit/accounts/${partnerId}/summary`);
    return data;
  },

  /** 設定 Base Credit Limit */
  setBaseLimit: async (partnerId: string, newBaseCreditLimit: number): Promise<void> => {
    await axios.put(`/credit/accounts/${partnerId}/base-limit`, { newBaseCreditLimit });
  },

  listAdjustmentsPaged: async (partnerId: string, page: number, pageSize: number): Promise<PagedResult<PartnerCreditAdjustmentDto>> => {
    const res = await axios.get<PagedResult<PartnerCreditAdjustmentDto>>(`/credit/accounts/${partnerId}/adjustments`, { params: { page, pageSize } });
    return res.data;
  },
  addPermanentAdjustment: async (input: { accountId: string; amount: number; reason: string }): Promise<void> => {
    await axios.post(`/credit/accounts/${input.accountId}/adjustments/permanent`, {
      amount: input.amount,
      reason: input.reason
    });
  },
  addTemporaryAdjustment: async (input: { accountId: string; amount: number; effectiveToUtc: string | null; reason: string }): Promise<void> => {
    await axios.post(`/credit/accounts/${input.accountId}/adjustments/temporary`, {
      amount: input.amount,
      effectiveToUtc: input.effectiveToUtc,
      reason: input.reason
    });
  },
  deactivateAdjustment: async (input: { accountId: string; adjustmentId: string }): Promise<void> => {
    await axios.post(`/credit/accounts/${input.accountId}/adjustments/${input.adjustmentId}/deactivate`);
  }
};