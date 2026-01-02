import axiosInstance from '@/core/http/axiosInstance';
import type { PagedResponse } from '@/core/types/api';
import type { User } from '@/features/users/types/userTypes';

export const fetchUsers = async (params: Record<string, unknown>): Promise<PagedResponse<User>> => {
  const response = await axiosInstance.get<PagedResponse<User>>('/users', { params });
  return response.data;
};

export const removeUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
