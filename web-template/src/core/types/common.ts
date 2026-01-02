export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}
/** 金額 + 幣別 */
export interface Money {
  /** 金額，數值 */
  amount: number;

  /** 幣別代碼，例如 "USD", "TWD" */
  currencyCode: string;
}