// features/sales/sales-record/types/dto.ts

// 狀態列舉：與後端數值對應
export const SalesRecordStatus = {
  Draft: 0,
  PendingCredit: 1,
  Approved: 2,
  Blocked: 3,
} as const;
export type SalesRecordStatus = typeof SalesRecordStatus[keyof typeof SalesRecordStatus]; // 0 | 1 | 2 | 3


// 後端：SalesRecordListItemDto
// 來源：Application.Sales.SalesRecords.Dtos.SalesRecordListItemDto
export interface SalesRecordDto {
  id: string;
  companyId: string;
  partnerId: string;
  partnerName: string;
  postingDate: string;   // 後端 DateOnly → 前端字串（YYYY-MM-DD）
  currencyCode: string;
  amount: number;
  status: SalesRecordStatus; // 後端 int
  note?: string;
}

// 後端：SalesRecordDetailDto
// 來源：Application.Sales.SalesRecords.Dtos.SalesRecordDetailDto
// export interface SalesRecordDetailDto {
//   id: string;
//   companyId: string;
//   partnerId: string;
//   postingDate: string;   // 後端 DateOnly → 前端字串（YYYY-MM-DD）
//   currencyCode: string;
//   amount: number;
//   status: SalesRecordStatus; // 後端 int
//   note?: string;
// }

// 建立請求（對應 CreateSalesRecordCommand）
export interface CreateSalesRecordRequest {
  partnerId: string;
  postingDate: string;   // 建議 YYYY-MM-DD
  currencyCode: string;
  amount: number;
  note?: string;
}

// 清單查詢參數（對應 GetSalesRecordsQuery）
// 注意：這是前端查詢物件，非後端 DTO
export interface SRListQuery {
  page: number;
  pageSize: number;
  keyword?: string;
  partnerId?: string;
  status?: SalesRecordStatus;
  postingFrom?: string;  // YYYY-MM-DD
  postingTo?: string;    // YYYY-MM-DD
}

/** 銷貨紀錄詳情 */
export interface SalesRecordDetailDto {
  id: string;
  companyId: string;
  partnerId: string;

  currencyCode: string;
  kind: string;
  status: SalesRecordStatus;

  postingDate: string;
  note?: string;

  invoiceId?: string;
  originalSalesRecordId?: string;
  originalInvoiceLineId?: string;

  // 金額三段
  netAmount: number;
  netAmountCurrencyCode: string;

  taxAmount: number;
  taxAmountCurrencyCode: string;

  grossAmount: number;
  grossAmountCurrencyCode: string;

  lines: SalesRecordLineDto[];
}

/** 銷貨紀錄明細 */
export interface SalesRecordLineDto {
  id: string;
  salesRecordId: string;

  productId?: string;
  skuId?: string;
  uomId?: string;

  quantity: number;
  quantityInBaseUom: number;

  // 金額（攤平）
  unitPriceAmount: number;
  unitPriceCurrencyCode: string;

  lineNetAmount: number;
  lineNetCurrencyCode: string;

  lineTaxAmount: number;
  lineTaxCurrencyCode: string;

  lineGrossAmount: number;
  lineGrossCurrencyCode: string;

  taxRate: number;

  // 快照
  snapshotSkuCode: string;
  snapshotSkuName: string;
  snapshotUomName: string;
}