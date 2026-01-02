import axios from "@/core/http/axiosInstance";
import type { CompanyItem } from '@/features/organization/company/types/dto';

export const fetchCompanies = async (): Promise<CompanyItem[]> => {
  const response = await axios.get<CompanyItem[]>('/companies');
  return response.data;
};

export const createCompany = async (data: Omit<CompanyItem, 'id'>): Promise<void> => {
  await axios.post('/companies', data);
};

// src/services/company.ts
export const updateCompany = async (company: CompanyItem): Promise<void> => {
  await axios.put(`/companies/${company.id}`, company);
};

export const deleteCompany = async (id: string): Promise<void> => {
  await axios.delete(`/companies/${id}`);
};
