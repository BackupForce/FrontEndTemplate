export interface ReceivableItem {
  id: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  issueDate: string;
  dueDate: string;
  accountingDate: string;
  originalAmount: number;
  baseAmount?: number;
  status: number;
  customerId: string;
  customerName: string;
}
