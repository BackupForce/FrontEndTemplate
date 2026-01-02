import axios from "@/core/http/axiosInstance";

// 取得某 Reconciliation 底下所有 ReconciliationReconcilableEntry
export async function getReconciliationReconcilableEntries(
  reconciliationId: string
): Promise<ReadonlyArray<{
  Id: string;
  ReconciliationId: string;
  ReconcilableEntryId: string;
  Amount: number;
  CreatedAt: string;
}>> {
  const url = `/reconciliations/${encodeURIComponent(reconciliationId)}/entries`;
  const { data } = await axios.get<ReadonlyArray<{
    Id: string;
    ReconciliationId: string;
    ReconcilableEntryId: string;
    Amount: number;
    CreatedAt: string;
  }>>(url);
  return data;
}

// 新增 ReconciliationReconcilableEntry 並同步更新 ReconcilableEntry
export async function createReconciliationReconcilableEntry(
  reconciliationId: string,
  payload: {
    ReconcilableEntryId: string;
  }
): Promise<string> {
  const url = `/reconciliations/${encodeURIComponent(reconciliationId)}/entries`;
  const { data } = await axios.post<{ Id: string } | { id: string }>(url, payload);
  return ("Id" in data ? (data as { Id: string }).Id : (data as { id: string }).id);
}

// 更新 ReconciliationReconcilableEntry 金額並同步更新 ReconcilableEntry
export async function updateReconciliationReconcilableEntry(
  reconciliationId: string,
  linkId: string,
  payload: { amount: number }
): Promise<void> {
  const url = `/reconciliations/${encodeURIComponent(reconciliationId)}/entries/${encodeURIComponent(linkId)}`;
  await axios.put<void>(url, payload);
}

// 刪除 ReconciliationReconcilableEntry 並回沖 ReconcilableEntry
export async function deleteReconciliationReconcilableEntry(
  reconciliationId: string,
  linkId: string
): Promise<void> {
  const url = `/reconciliations/${encodeURIComponent(reconciliationId)}/entries/${encodeURIComponent(linkId)}`;
  await axios.delete<void>(url);
}