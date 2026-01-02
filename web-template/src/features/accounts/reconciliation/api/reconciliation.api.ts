import axios from "@/core/http/axiosInstance";
import type { 
  ReconciliationDto, 
  ReconciliationDetailDto, 
  CashTransactionListItemDto, 
  ReconcilableEntryDto,
  CreateReconciliationRequest,
  UpdateReconciliationRequest,
  GetUnreconciledCashTransactionsRequest,
  GetReconciliationsRequest
} from "@/features/accounts/reconciliation/types/dto";
import type { PagedResult } from "@/core/types/paged-result";

export async function getReconciliations(
  input: GetReconciliationsRequest
): Promise<PagedResult<ReconciliationDto>> {
  const res = await axios.get<PagedResult<ReconciliationDto>>("/reconciliations", { params: input });
  return res.data;
}

export async function getReconciliationById(id: string): Promise<ReconciliationDetailDto> {
  const res = await axios.get<ReconciliationDetailDto>(`/reconciliations/${id}`);
  return res.data;
}

export async function createReconciliation(input: CreateReconciliationRequest): Promise<void> {
  await axios.post("/reconciliations", input);
}

export async function updateReconciliation(id: string, input: UpdateReconciliationRequest): Promise<void> {
  await axios.put(`/reconciliations/${id}`, input);
}

export async function deleteReconciliation(id: string): Promise<void> {
  await axios.delete(`/reconciliations/${id}`);
}

export async function completeReconciliation(id: string): Promise<void> {
  await axios.post<void>(`/reconciliations/${id}/complete`, {});
}

export async function reversecompleteReconciliation(id: string): Promise<void> {
  await axios.post<void>(`/reconciliations/${id}/reverse-complete`, {});
}

/**
 * GET /reconciliations/{id}/unreconciled-entries
 * 透過 ReconciliationId 取得該 Partner 的未完全沖銷 ReconcilableEntry 清單
 */
export async function getUnreconciledEntriesByReconciliationId(
  reconciliationId: string
): Promise<ReconcilableEntryDto[]> {
  const url = `/reconciliations/${encodeURIComponent(reconciliationId)}/unreconciled-entries`;
  const { data } = await axios.get<ReconcilableEntryDto[]>(url);
  return data;
}

export async function getUnreconciledCashTransactionsByReconciliationId(
  id: string,
  params: GetUnreconciledCashTransactionsRequest
): Promise<PagedResult<CashTransactionListItemDto>> {
  const { data } = await axios.get<PagedResult<CashTransactionListItemDto>>(
    `/reconciliations/${id}/unreconciled-cash-transactions`,
    { params }
  );
  return data;
}