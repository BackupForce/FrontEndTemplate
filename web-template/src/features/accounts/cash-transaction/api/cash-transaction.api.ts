import axios from "@/core/http/axiosInstance";
import type { CashTransactionItem, CreateCashTransactionRequest, CashTransactionDetail } from "@/features/accounts/cash-transaction/types/dto";
import type { PagedResult } from "@/core/types/paged-result";

export async function getCashTransactions(input: {
  page: number;
  pageSize: number;
}): Promise<PagedResult<CashTransactionItem>> {
  const res = await axios.get<PagedResult<CashTransactionItem>>("/cash-transactions", {
    params: input,
  });
  return res.data;
}

export async function createCashTransaction(input: CreateCashTransactionRequest): Promise<string> {
  const res = await axios.post<string>("/cash-transactions", input);
  return res.data;
}

export async function deleteCashTransaction(id: string): Promise<void> {
  await axios.delete(`/cash-transactions/${id}`);
}

export async function getCashTransactionById(id: string): Promise<CashTransactionDetail> {
  const res = await axios.get<CashTransactionDetail>(`/cash-transactions/${id}`);
  return res.data;
}

export async function updateCashTransaction(id: string, input: CreateCashTransactionRequest): Promise<void> {
  await axios.put(`/cash-transactions/${id}`, input);
}

