import type { PaginationQuery } from "@/core/types/common";
import axios from "@/core/http/axiosInstance";
import type { ReceivableItem } from "@/features/accounts/receivable/types/dto";

export const getReceivables = async (params: PaginationQuery) => {
  const res = await axios.get<{
    items: ReceivableItem[];
    totalCount: number;
    page: number;
  }>("/receivables", { params });

  return res.data;
};

export const createReceivable = async (data: unknown) => {
  const res = await axios.post<string>("/receivables", data);
  return res.data;
};

export const deleteReceivable = async (id: string): Promise<void> => {
  await axios.delete(`/receivables/${id}`);
};