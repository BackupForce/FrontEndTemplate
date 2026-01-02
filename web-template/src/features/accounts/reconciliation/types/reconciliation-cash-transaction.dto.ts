export type ReconciliationCashTransactionDto = {
  id: string;
  reconciliationid: string;
  cashtransactionid: string;
  amount: number;
  currencycode: string;
  note?: string;
};

export type CreateReconciliationCashTransactionRequest = {
  cashtransactionid: string;
};

export type UpdateReconciliationCashTransactionRequest = {
  amount?: number;
  note?: string;
};

