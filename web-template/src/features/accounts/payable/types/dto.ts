export interface PayableItem {
  id: string;
  billNumber: string;
  issueDate: string; // DateOnly 會對應到 string
  dueDate: string;
  originalAmountValue: number;
  originalAmountCurrency: string;
  status: string;
  supplierName: string;
  supplierId: string;
}

export interface CreatePayableRequest {
  billNumber: string;
  issueDate: string; // DateOnly as ISO string
  dueDate: string;
  originalAmountValue: number;
  originalAmountCurrency: string;
  status: string;
  supplierName: string;
}

export interface UpdatePayableRequest {
  billNumber: string;
  issueDate: string; // yyyy-MM-dd
  dueDate: string;
  originalAmountValue: number;
  originalAmountCurrency: string;
  status: string;
  supplierName: string;
}

// export interface PayableItem {
//   id: string;
//   billNumber: string;
//   issueDate: string; // ISO 8601 格式，前端自行轉換
//   dueDate: string;
//   originalAmount: number;
//   baseAmount: number;
//   status: number; // 0: unpaid, 1: partialPaid, 2: paid, 3: overdue, 4: canceled
//   supplierName: string;
// }