// src/api/auth.ts
import type { AuthUser, LoginDto, LoginResponse, RefreshResponse } from '../types/dto';
import axios from "@/core/http/axiosInstance";

export async function fetchMe(): Promise<AuthUser> {
  const res = await axios.get<AuthUser>("/auth/me");
  return res.data;
}


export async function login(input: LoginDto): Promise<LoginResponse> {
   const res = await axios.post<LoginResponse>('/auth/login', input);
   return res.data;
}

export async function refresh(): Promise<RefreshResponse> {
  const res = await axios.post<RefreshResponse>("/auth/refresh", null, {
    withCredentials: true, // ⚠️ 一定要帶上，否則 cookie 不會送出
  });

  return res.data;
}