
import axios from "@/core/http/axiosInstance";
import type { ReconciliationCashTransactionDto, CreateReconciliationCashTransactionRequest, UpdateReconciliationCashTransactionRequest } from "@/features/accounts/reconciliation/types/reconciliation-cash-transaction.dto"


export async function getReconciliationCashTransactionsByReconciliationId(
  id: string
): Promise<ReconciliationCashTransactionDto[]> {
  const { data } = await axios.get<ReconciliationCashTransactionDto[]>(
    `/reconciliations/${id}/cash-transactions`
  );
  return data;
}

export async function createReconciliationCashTransaction(
  id: string,
  input: CreateReconciliationCashTransactionRequest
): Promise<ReconciliationCashTransactionDto> {
  const { data } = await axios.post<ReconciliationCashTransactionDto>(
    `/reconciliations/${id}/cash-transactions`,
    input
  );
  return data;
}

export async function updateReconciliationCashTransaction(
  id: string,
  linkId: string,
  input: UpdateReconciliationCashTransactionRequest
): Promise<ReconciliationCashTransactionDto> {
  const { data } = await axios.put<ReconciliationCashTransactionDto>(
    `/reconciliations/${id}/cash-transactions/${linkId}`,
    input
  );
  return data;
}

export async function deleteReconciliationCashTransaction(
  id: string,
  linkId: string
): Promise<void> {
  await axios.delete<void>(`/reconciliations/${id}/cash-transactions/${linkId}`);
}