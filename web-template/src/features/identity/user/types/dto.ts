
export interface UserItem {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}