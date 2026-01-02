// NEW: 調整紀錄 DTO（可與後端共用型別檔，這裡先內嵌）
export interface PartnerCreditAdjustmentDto {
  id: string;
  amount: number;
  isTemporary: boolean;
  effectiveFromUtc: string;
  effectiveToUtc?: string | null;
  isActive: boolean;
  reason?: string | null;
  createdBy: string;
  createdAtUtc: string;
  sourceType?: string | null;
  sourceId?: string | null;
}