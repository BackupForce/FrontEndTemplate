// features/accounts/expense-entry/types/dto.ts

/** ExpenseEntry 清單用 DTO（列表頁） */
export interface ExpenseEntryDto {
  id: string;
  entryDate: string;              // ISO 日期字串（yyyy-MM-dd 或 yyyy-MM-ddTHH:mm:ssZ）
  dueDate: string;                // ISO 日期字串
  originalAmountValue: number;
  originalAmountCurrency: string;
  status: number;                 // 後端目前為 int，如有 enum 可再改型別
  description?: string | null;
  categoryId: string;
  categoryName: string;
}

/** ExpenseEntry 明細用 DTO（詳情頁）— 映射後端 ExpenseEntryDetailDto.cs */
export interface ExpenseEntryDetailDto {
  id: string;
  entryDate: string;              // 對應後端 DateOnly
  dueDate: string;                // 對應後端 DateOnly
  originalAmountValue: number;
  originalAmountCurrency: string;
  status: number;
  description?: string | null;
  categoryId: string;
  categoryName: string;
}

/** 建立 ExpenseEntry 的請求模型 */
export interface CreateExpenseEntryRequest {
  entryDate: string;              // yyyy-MM-dd（建議後端接受 ISO）
  dueDate: string;                // yyyy-MM-dd
  originalAmountValue: number;
  originalAmountCurrency: string; // 例如: "TWD"
  status: number;
  description?: string | null;
  categoryId: string;
}

/** 更新 ExpenseEntry 的請求模型（不含 id，依路由帶 id） */
export interface UpdateExpenseEntryRequest {
  entryDate: string;              // yyyy-MM-dd
  dueDate: string;                // yyyy-MM-dd
  originalAmountValue: number;
  originalAmountCurrency: string;
  status: number;
  description?: string | null;
  categoryId: string;
}

/** 清單查詢條件（比照你的寫法直接列出 page/pageSize） */
export interface EEListQuery {
  page: number;
  pageSize: number;
  /** 依關鍵字搜尋（可對 description / categoryName 等後端自行決定） */
  keyword?: string;
  /** 類別過濾 */
  categoryId?: string;
  /** 狀態過濾（如果你之後有 enum，可把 number 換成對應 enum） */
  status?: number;
  /** 起訖日期過濾（字串：yyyy-MM-dd 或 ISO） */
  fromDate?: string;
  toDate?: string;
}
