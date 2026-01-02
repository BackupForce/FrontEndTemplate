export interface CashTransactionCandidateDto {
  id: string;
  referenceNumber: string;
  transactionDate: string;
  amount: number;
  remainingAmount: number;
  note?: string;
}


export async function getCashTransactionCandidates(reconcilableEntryId: string): Promise<CashTransactionCandidateDto[]> {
  const response = await axios.get<CashTransactionCandidateDto[]>(`/reconciliations/${reconcilableEntryId}/unreconciled-cash-transactions`);
  return response.data;
}
