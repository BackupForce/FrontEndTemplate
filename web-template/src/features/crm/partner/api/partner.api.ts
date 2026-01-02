import axios from "@/core/http/axiosInstance";
import type { PartnerItem, CreatePartnerDto,PartnerDetailDto  } from "@/features/crm/partner/types/dto";

// 取得 Partner 清單
export const fetchPartners = async (): Promise<PartnerItem[]> => {
  const response = await axios.get<PartnerItem[]>("/partners");
  return response.data;
};

// 建立 Partner
export const createPartner = async (data: CreatePartnerDto): Promise<void> => {
  await axios.post("/partners", data);
};

// 更新 Partner
export const updatePartner = async (
  id: string,
  data: CreatePartnerDto
): Promise<void> => {
  await axios.put(`/partners/${id}`, data);
};

// 刪除 Partner
export const deletePartner = async (id: string): Promise<void> => {
  await axios.delete(`/partners/${id}`);
};

/** 取得 Partner 詳細（CompanyId 由後端從 Request 解析） */
export async function getPartnerDetail(partnerId: string): Promise<PartnerDetailDto> {
  const { data } = await axios.get<PartnerDetailDto>(`/partners/${partnerId}`);
  return data;
}
