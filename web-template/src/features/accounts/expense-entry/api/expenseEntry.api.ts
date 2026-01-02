// features/finance/cash/expense-entry/apis/expenseEntry.api.ts
import axios from "@/core/http/axiosInstance";
import type {
  ExpenseEntryDto,
  ExpenseEntryDetailDto,
  CreateExpenseEntryRequest,
  UpdateExpenseEntryRequest,
  EEListQuery
} from "@/features/accounts/expense-entry/types/dto";
import type { PagedResult } from "@/core/types/paged-result";

export const expenseEntryApi = {
  /** 建立 ExpenseEntry */
  create: async (input: CreateExpenseEntryRequest): Promise<void> => {
    await axios.post("/expense-entries", input);
  },

  /** 更新 ExpenseEntry */
  update: async (id: string, input: UpdateExpenseEntryRequest): Promise<void> => {
    await axios.put(`/expense-entries/${id}`, input);
  },

  /** 刪除 ExpenseEntry */
  remove: async (id: string): Promise<void> => {
    await axios.delete(`/expense-entries/${id}`);
  },

  /** 取得 ExpenseEntry 清單 */
  list: async (q: EEListQuery): Promise<PagedResult<ExpenseEntryDto>> => {
    const params: Record<string, unknown> = {
      page: q.page,
      pageSize: q.pageSize,
    };

    if (q.categoryId) {
      params.categoryId = q.categoryId;
    }
    if (typeof q.status === "number") {
      params.status = q.status;
    }
    if (q.fromDate) {
      params.fromDate = q.fromDate; // 建議傳 ISO 字串或 yyyy-MM-dd
    }
    if (q.toDate) {
      params.toDate = q.toDate;
    }
    if (q.keyword) {
      params.keyword = q.keyword;
    }

    const res = await axios.get<PagedResult<ExpenseEntryDto>>("/expense-entries", { params });
    return res.data;
  },

  /** 依 Id 取得 ExpenseEntry 明細 */
  getById: async (id: string): Promise<ExpenseEntryDetailDto> => {
    const res = await axios.get<ExpenseEntryDetailDto>(`/expense-entries/${id}`);
    return res.data;
  },
};
