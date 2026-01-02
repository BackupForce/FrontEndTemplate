import { createContext } from 'react';
import type { AuthUser } from '@/features/identity/auth/types/dto';

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  hasPermission: (key: string) => boolean;
  isRoot: () => boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  setUser: () => {},
  hasPermission: () => false,
  isRoot: () => false,
});
