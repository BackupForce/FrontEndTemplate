// features/finance/cash/financial-account/apis/financialAccount.api.ts
import axios from "@/core/http/axiosInstance";
import type {
  FinancialAccountDto,
  FinancialAccountDetailDto,
  CreateFinancialAccountRequest,
  UpdateFinancialAccountRequest,
} from "@/features/accounts/financial-account/types/dto";

/**
 * 建立 FinancialAccount
 * 後端為 201 Created，為保持與 payable.api.ts 一致，此處不消費回傳內容。
 */
export const createFinancialAccount = async (
  input: CreateFinancialAccountRequest
): Promise<void> => {
  await axios.post("/financial-accounts", input);
};

/**
 * 更新 FinancialAccount
 * 後端為 204 No Content。
 */
export const updateFinancialAccount = async (
  id: string,
  input: UpdateFinancialAccountRequest
): Promise<void> => {
  await axios.put(`/financial-accounts/${id}`, input);
};

/**
 * 刪除 FinancialAccount
 * 後端為 204 No Content。
 */
export const deleteFinancialAccount = async (id: string): Promise<void> => {
  await axios.delete(`/financial-accounts/${id}`);
};

/**
 * 取得 FinancialAccount 清單
 * 對應 GET /financial-accounts，回傳 FinancialAccountDto[]。
 * （目前後端未提供分頁參數，若未來有需要可再擴充。）
 */
export const getFinancialAccounts = async (): Promise<
  FinancialAccountDto[]
> => {
  const res = await axios.get<FinancialAccountDto[]>("/financial-accounts");
  return res.data;
};

/**
 * 依 Id 取得 FinancialAccount 明細
 * 對應 GET /financial-accounts/{id}，回傳 FinancialAccountDetailDto。
 */
export const getFinancialAccountById = async (
  id: string
): Promise<FinancialAccountDetailDto> => {
  const res = await axios.get<FinancialAccountDetailDto>(
    `/financial-accounts/${id}`
  );
  return res.data;
};
