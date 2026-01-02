export interface CreateIncomeEntryRequest {
  entryDate: string;
  dueDate: string;
  originalAmountValue: number;
  originalAmountCurrency: string;
  description?: string;
  categoryId: string;
}


export interface GetIncomeEntriesParams {
  page: number;
  pageSize: number;
  entryDateFrom?: string;
  entryDateTo?: string;
  categoryId?: string;
  status?: number;
}

export interface IncomeEntryItem {
  id: string;
  entryDate: string;
  dueDate: string;
  originalAmountValue: number;
  originalAmountCurrency: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  status: number;
}

export interface GetIncomeEntriesResponse {
  items: IncomeEntryItem[];
  totalCount: number;
}

export interface UpdateIncomeEntryRequest {
  entryDate: string;
  dueDate: string;
  originalAmountValue: number;
  originalAmountCurrency: string;
  description?: string;
  categoryId: string;
}