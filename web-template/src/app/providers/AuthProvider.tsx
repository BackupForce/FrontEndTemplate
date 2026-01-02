import { useEffect, useState } from "react";
import { fetchMe, refresh } from "@/features/identity/auth/api/auth.api";
import { AuthContext } from "../../core/context/AuthContext";
import type { AuthUser } from "@/features/identity/auth/types/dto";
import { authToken } from "@/core/auth/authToken";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      let token = authToken.get();

      // 沒有 token → 試圖使用 refreshToken 換新 token
      if (!token) {
        const result = await refresh();
        token = result.token;
        authToken.set(token);
      }

      // 不論是原 token 或新的，嘗試取得使用者資訊
      const me = await fetchMe();
      setUser(me);
    } catch (error) {
      // 任一失敗（包含 refresh 或 /me）都視為未登入
      authToken.remove();
      setUser(null);
      console.warn("🔒 Auth init failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (key: string): boolean =>
    (user?.isRoot || user?.permissions.includes(key)) ?? false;

  const isRoot = (): boolean => user?.isRoot ?? false;

  return (
    <AuthContext.Provider
      value={{ user, isLoading, setUser, hasPermission, isRoot }}
    >
      {children}
    </AuthContext.Provider>
  );
};
