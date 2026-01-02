/**
 * 金融帳戶清單用 DTO
 * 對應後端 Application.Finance.Cash.FinancialAccounts.Dtos.FinancialAccountDto
 */
export interface FinancialAccountDto {
  id: string;
  name: string;
  type: string;            // 後端目前為 string，若未來有 enum 可再收斂
  bankName?: string;
  accountNumber?: string;
  balance: number;         // decimal -> number
  currencyId: string;
  note?: string;
}

/**
 * 金融帳戶明細 DTO：在 FinancialAccountDto 基礎上包含 companyId
 * 對應後端 Application.Finance.Cash.FinancialAccounts.Dtos.FinancialAccountDetailDto
 */
export interface FinancialAccountDetailDto extends FinancialAccountDto {
  companyId: string;
}

/**
 * 建立金融帳戶的請求模型
 * 假設建立時需要 companyId（由明細 DTO 可見該欄位存在），
 * balance 代表期初餘額（若後端不允許在建立時指定，請移除此欄位）
 */
export interface CreateFinancialAccountRequest {
  companyId: string;
  name: string;
  type: string;
  bankName?: string;
  accountNumber?: string;
  balance: number;
  currencyId: string;
  note?: string;
}

/**
 * 更新金融帳戶的請求模型
 * 一般情境下不允許更新 companyId；balance 是否允許更新取決於你的商業規則。
 * 若後端禁止直接改餘額（改由交易/調整單處理），請將 balance 移除。
 */
export interface UpdateFinancialAccountRequest {
  name: string;
  type: string;
  bankName?: string;
  accountNumber?: string;
  currencyId: string;
  note?: string;

  // 若你的系統允許直接調整餘額（非交易導致），再放開此欄位
  // balance?: number;
}


export interface FAListQuery {
  page: number;
  pageSize: number;
  name?: string;
  type?: string;
  currencyId?: string;
}