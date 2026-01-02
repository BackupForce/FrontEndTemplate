import type { Money, PaginationQuery } from "@/core/types/common";


export interface CreateInvoiceRequest {
  customerId: string;
  currencyCode: string;
  issueDate: string; // DateOnly: 'YYYY-MM-DD'
  postingDate?: string;  // DateOnly: 'YYYY-MM-DD'
  referenceNumber?: string;
  note?: string;
}

export interface CreateInvoiceResponse {
  id: string;
}

/** 發票清單項目 */
export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  status: string; // Draft, Issued, Cancelled...
  currencyCode: string;
  totalAmount: Money;
  createdAt: string;
  updatedAt?: string;
}

/** 發票詳細資訊 */
export interface InvoiceDetailDto {
  id: string;
  companyId: string;
  invoiceNumber: string;
  status: number; // 後端傳 int
  customerId: string;
  customerName: string;
  currencyCode: string;

  issueDate: string;
  postingDate: string;
  dueDate?: string;

  subtotalAmount: number;
  subtotalCurrencyCode: string;

  taxAmount: number;
  taxAmountCurrencyCode: string;

  totalAmount: number;
  totalAmountCurrencyCode: string;

  createdAt?: string;
  updatedAt?: string;

  // 關聯的明細
  lines: InvoiceLineDto[];
}

/** 發票明細 */
export interface InvoiceLineDto {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;

  unitPriceAmount: number;
  unitPriceCurrencyCode: string;

  lineAmount: number;
  lineAmountCurrencyCode: string;

  // 若有來源對應 (SalesRecord, Reconciliation...)
  sourceType: number; // 後端 int(enum)
  sourceDocumentId?: string;
  sourceLineNo?: number;
}


/** 更新發票 */
export interface UpdateInvoiceRequest {
  invoiceNumber?: string;
  currencyCode?: string;
}

/** 查詢發票清單 */
export interface GetInvoicesRequest extends PaginationQuery {
  status?: string;
  currencyCode?: string;
  fromDate?: string;
  toDate?: string;
}

/** 新增明細 */
export interface AddInvoiceLineRequest {
  description: string;
  quantity: number;
  unitPriceAmount: number;
  sourceType?: string;
  sourceId?: string;
  sourceLineNo?: string;
}

export interface AvailableSalesRecordDto {
  /** SalesRecord.Id */
  id: string;
  /** 過帳日 (ISO yyyy-MM-dd) */
  postingDate: string;
  /** 幣別（與 Invoice 一致） */
  currencyCode: string;
  /** 金額（GrossAmount 攤平成 number） */
  amount: number;
  /** 備註（可空） */
  note?: string;
}

/** 批次加入 SR 的請求 */
export interface AddInvoiceLinesFromSalesRecordsRequest {
  salesRecordIds: string[]; // 要加入的 SalesRecord Id 清單
}

/** 批次加入 SR 的單筆失敗資訊 */
export interface AddInvoiceLinesFromSalesRecordsResultItemFailure {
  salesRecordId: string;
  code: string;    // 例如：Invoice.SalesRecordNotApproved / Invoice.PartnerMismatch ...
  message: string; // 顯示用訊息
}

/** 批次加入 SR 的回傳結果 */
export interface AddInvoiceLinesFromSalesRecordsResult {
  succeeded: string[]; // 成功加入的 SR Id 清單
  failed: AddInvoiceLinesFromSalesRecordsResultItemFailure[]; // 失敗清單（含原因）
}

export interface CreateFromSalesRecordsRequest {
  documentKind: number;     // 後端 enum: DocumentKind（用 number 傳最穩）
  issueDate: string;        // "YYYY-MM-DD"
  postingDate: string;      // "YYYY-MM-DD"
  invoiceType: number;      // 後端 enum: SaleMode（用 number 傳最穩）
  salesRecordIds: string[]; // 來源 SR
  invoiceNumber?: string | null;
}

export interface CreateFromSalesRecordsResponse {
  id: string;
}