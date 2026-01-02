// 建立 Partner 時用的 DTO 型別
export interface CreatePartnerDto {
  name: string;
  type: string; // PartnerType：視情況可用 enum 或 string
  isCustomer: boolean;
  isSupplier: boolean;
  companyId: string;
  parentPartnerId?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface PartnerItem {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  isCustomer: boolean;
  isSupplier: boolean;
  type: string;
}

export interface PartnerDetailDto {
  id: string;
  companyId: string;
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  // 你原本有的欄位都可補上
}

export interface PartnerCreditSummaryDto {
  
  partnerCreditAccountId: string;
  companyId: string;
  partnerId: string;
  baseCreditLimit: number;
  activeAdjustments: number;
  effectiveCreditLimit: number;
  exposure: number;
  availableCredit: number;
  isCreditHold: boolean;
  holdReason?: string;
  activeTemporaryAdjustments: number;
  activePermanentAdjustments: number;
}