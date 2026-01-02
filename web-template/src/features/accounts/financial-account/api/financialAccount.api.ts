// features/finance/cash/financial-account/apis/financialAccount.api.ts
import axios from "@/core/http/axiosInstance";
import type {
  FinancialAccountDto,
  FinancialAccountDetailDto,
  CreateFinancialAccountRequest,
  UpdateFinancialAccountRequest,
  FAListQuery
} from "@/features/accounts/financial-account/types/dto";
import type {PagedResult} from "@/core/types/paged-result";

export const financialAccountApi = {
  /** 建立 FinancialAccount */
  create: async (input: CreateFinancialAccountRequest): Promise<void> => {
    await axios.post("/financial-accounts", input);
  },

  /** 更新 FinancialAccount */
  update: async (
    id: string,
    input: UpdateFinancialAccountRequest
  ): Promise<void> => {
    await axios.put(`/financial-accounts/${id}`, input);
  },

  /** 刪除 FinancialAccount */
  remove: async (id: string): Promise<void> => {
    await axios.delete(`/financial-accounts/${id}`);
  },

  /** 取得 FinancialAccount 清單 */
  list: async (q: FAListQuery): Promise<PagedResult<FinancialAccountDto>> => {
    const params: Record<string, unknown> = {
      page: q.page,
      pageSize: q.pageSize,
    };
    if (q.name) {
      params.name = q.name;
    }
    if (q.type) {
      params.type = q.type;
    }
    if (q.currencyId) {
      params.currencyId = q.currencyId;
    }

    const res = await axios.get<PagedResult<FinancialAccountDto>>(
      "/financial-accounts",
      { params }
    );
    return res.data;
  },
  /** 依 Id 取得 FinancialAccount 明細 */
  getById: async (id: string): Promise<FinancialAccountDetailDto> => {
    const res = await axios.get<FinancialAccountDetailDto>(
      `/financial-accounts/${id}`
    );
    return res.data;
  },
};
