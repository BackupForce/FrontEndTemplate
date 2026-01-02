export interface ReconciliationDto {
  id: string;
  referenceNumber?: string;
  note?: string;
  reconciledAt: string; // 建議用 ISO 字串，處理時用 dayjs 轉換
  status: string;
  partnerId: string;
  partnerName: string;
}

export interface ReconciliationDetailDto {
  id: string;
  referenceNumber?: string;
  note?: string;
  reconciledAt: string;
  status: string;
  partnerId: string;
  partnerName: string;
  cashTransactionLinks: CashTransactionLinkDto[];
  reconcilableEntryLinks: ReconcilableEntryLinkDto[];
}

export interface ReconcilableEntryDto {
  id: string;
  entryType: string;
  referenceNumber: string;
  partnerName: string;
  dueDate: string;     // 後端 DateOnly，前端以 YYYY-MM-DD 字串接收
  originalAmount: number;
  remainingAmount: number;
  currencyCode: string;
}

export interface CashTransactionListItemDto {
  id: string;
  referenceNumber: string;
  transactionDate: string;
  amount: number;
  remainingAmount: number;
  note?: string;
}

export interface CashTransactionLinkDto {
  
  cashTransactionLinkId: string;
  cashTransactionId: string;
  amount: number;
  currencyCode: string;
  originalAmount: number;
  remainingAmount: number;
  transactionDate: string; // YYYY-MM-DD
  financialAccountName: string;
  referenceNumber?: string;
  note?: string;
  direction: number;
}

export interface ReconcilableEntryLinkDto {
  reconcilableEntryLinkId: string;
  reconcilableEntryId: string;
  amount: number;
  currencyCode: string;

  originalAmount: number;
  remainingAmount: number;
  dueDate: string; // YYYY-MM-DD
  partnerName: string;
  entryType: string;
  note?: string;
  direction: number;
}

export interface GetUnreconciledCashTransactionsRequest {
  financialAccountId?: string;
  dateFrom?: string;   // ISO yyyy-MM-dd
  dateTo?: string;     // ISO yyyy-MM-dd
  page?: number;
  pageSize?: number;
}


export interface GetReconciliationsRequest {
  page: number;
  pageSize: number;
  reconciledAtFrom?: string;
  reconciledAtTo?: string;
  status?: string;
}

export interface CreateReconciliationRequest {
  referenceNumber: string;
  reconciledAt: string; // YYYY-MM-DD
  currencyCode: string;
  note?: string;
  partnerId: string;
}

export interface UpdateReconciliationRequest {
  referenceNumber: string;
  //reconciledAt: string; // YYYY-MM-DD
  note?: string;
}



