import axios from "@/core/http/axiosInstance";
//import type { PagedResult } from "@/models/paged-result";
import type { UserItem, CreateUserInput } from "@/features/identity/user/types/dto";

export async function fetchUsers(): Promise<UserItem[]> {
  const res = await axios.get<UserItem[]>("/users", );
  return res.data;
}

export async function deleteUser(userId: string) {
  await axios.delete(`/users/${userId}`);
}

export async function createUser(input: CreateUserInput): Promise<void> {
  await axios.post('/users', input);
}