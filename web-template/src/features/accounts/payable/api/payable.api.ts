import axios from "@/core/http/axiosInstance";
import type {
  PayableItem,
  CreatePayableRequest,
  UpdatePayableRequest,
} from "@/features/accounts/payable/types/dto";

export const createPayable = async (
  input: CreatePayableRequest
): Promise<void> => {
  await axios.post("/payables", input);
};

export const updatePayable = async (
  id: string,
  input: UpdatePayableRequest
): Promise<void> => {
  await axios.put(`/payables/${id}`, input);
};

export const deletePayable = async (id: string): Promise<void> => {
  await axios.delete(`/payables/${id}`);
};

export interface GetPayablesParams {
  page: number;
  pageSize: number;
  issueDateFrom?: string;
  issueDateTo?: string;
  supplierId?: string;
  status?: number;
}

export interface GetPayablesResponse {
  items: PayableItem[];
  totalCount: number;
}

export const getPayables = async (
  params: GetPayablesParams
): Promise<GetPayablesResponse> => {
  const res = await axios.get<GetPayablesResponse>("/payables", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      issueDateFrom: params.issueDateFrom,
      issueDateTo: params.issueDateTo,
      supplierId: params.supplierId,
      status: params.status,
    },
  });

  return res.data;
};
