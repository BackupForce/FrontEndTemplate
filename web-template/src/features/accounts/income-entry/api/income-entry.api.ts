import axios from "@/core/http/axiosInstance";
import type { CreateIncomeEntryRequest, UpdateIncomeEntryRequest, GetIncomeEntriesParams, GetIncomeEntriesResponse } from "@/features/accounts/income-entry/types/dto";


export const createIncomeEntry = async (
  input: CreateIncomeEntryRequest
): Promise<void> => {
  await axios.post("/income-entries", input);
};

export const updateIncomeEntry = async (
  id: string,
  input: UpdateIncomeEntryRequest
): Promise<void> => {
  await axios.put(`/income-entries/${id}`, input);
};

export const deleteIncomeEntry = async (id: string): Promise<void> => {
  await axios.delete(`/income-entries/${id}`);
};

export const getIncomeEntries = async (
  params: GetIncomeEntriesParams
): Promise<GetIncomeEntriesResponse> => {
  const res = await axios.get<GetIncomeEntriesResponse>("/income-entries", {
    params,
  });

  return res.data;
};
