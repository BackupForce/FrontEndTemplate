export interface AuthUser {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  isRoot: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: Date;
}

export type RefreshResponse = {
  token: string;
};