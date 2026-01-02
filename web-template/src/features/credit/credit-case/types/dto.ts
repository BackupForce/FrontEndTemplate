// features/credit/credit-case/types/dto.ts
/** CreditCase 狀態 enum，與後端 Domain.Credit.Shared.Enums.CreditCaseStatus 對齊 */
/** 用字面量 union 取代 enum，編譯後不會留下代碼 */
export type CreditCaseStatus = 0 | 1 | 2 | 3;

/** 常數物件僅供對照用，不會在型別系統內產生 enum */
export const CreditCaseStatusConst = {
  Open: 0,
  Approved: 1,
  Rejected: 2,
  Closed: 3
} as const;

/** 清單項目 DTO，對應 GetCreditCasesQuery 回傳的 CreditCaseListItemDto */
export interface CreditCaseDto {
  id: string;
  companyId: string;
  partnerId: string;
  exposure: number;
  creditLimit: number;
  status: CreditCaseStatus;
  triggerSourceType: string;
  triggerSourceId: string;
  triggerAmount: number;
  createdAt?: string; // 如後端有提供時間欄位可加上
  updatedAt?: string;
}

/** 明細 DTO，與 CreditCaseDto 保持一致，後續如後端有更多欄位可擴充 */
export interface CreditCaseDetailDto extends CreditCaseDto {}

/** 建立手動 CreditCase 的請求，對應 CreateManualCreditCaseRequest */
export interface CreateManualCreditCaseRequest {
  partnerId: string;
  triggerSourceType: string;
  triggerSourceId?: string | null;
  triggerAmount: number;
}

/** 審核通過請求，對應 ApproveCreditCaseRequest */
export interface ApproveCreditCaseRequest {
  financialAccountId: string;
  currencyCode: string;
  approver: string;
  reason?: string;
}

/** 清單查詢條件，對應 GET /credit-cases */
export interface CCListQuery {
  page: number;
  pageSize: number;
  partnerId?: string;
  financialAccountId?: string;
  status?: CreditCaseStatus;
  keyword?: string;
  createdFrom?: string;
  createdTo?: string;
}
