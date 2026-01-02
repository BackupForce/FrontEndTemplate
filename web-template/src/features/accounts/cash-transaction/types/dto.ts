import { Dayjs } from "dayjs";

export interface CashTransactionItem {
  id: string;
  transactionDate: string; // DateOnly 可用 ISO string
  yearMonth: number;
  amount: number;
  currency: string;
  direction: number;
  financialAccountId: string;
  financialAccountName: string;
  referenceNumber?: string;
  note?: string;
}

export interface CreateCashTransactionRequest {
  transactionDate: string; // yyyy-MM-dd
  amount: number;
  currency: string;
  direction: number; // 0 = 收入, 1 = 支出
  financialAccountId: string;
  referenceNumber?: string;
  note?: string;
}

export interface CashTransactionDetail {
  id: string;
  transactionDate: string;
  yearMonth: number;
  amount: number;
  currency: string;
  direction: number;
  financialAccountId: string;
  financialAccountName: string;
  companyName: string;
  referenceNumber?: string;
  note?: string;
  reconciliations: CashTransactionReconciliationDto[]
}

export interface CashTransactionFormValues {
  transactionDate: Dayjs;
  amount: number;
  currency: string;
  direction: number;
  financialAccountId: string;
  referenceNumber?: string;
  note?: string;
}


export interface CashTransactionReconciliationDto {
  id: string; // Reconciliation Id
  entryType: "receivable" | "payable";
  entryId: string;
  partnerName: string;
  entryDate: string; // DateOnly 字串，例如 "2025-08-01"
  entryAmount: number;
  reconciledAmount: number;
  note?: string;
  referenceNumber: string;
  remainingAmount: number;

}

export interface ReconcilableEntryCandidateDto {
  id: string;
  entryType: "receivable" | "payable" | "income" | "expense";
  partnerName?: string;
  entryDate: string; // 建議為 ISO 字串，如 "2025-08-01"
  amount: number;
  remainingAmount: number;
  note?: string;
}

export interface AddCashTransactionReconciliationRequest {
  entryId: string;
  entryType: string;
  reconciledAmount: number;
}