import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/core/http/axiosInstance';
import { clearAuthTokens, getAuthTokens, setAuthTokens, type AuthTokens } from '@/core/auth/authToken';
import { tAuth } from '@/shared/i18n/helpers';
import { navigate as globalNavigate } from '@/app/router/navigator';

export interface CurrentUser {
  Id: string;
  Email: string;
  Name: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextValue {
  IsAuthenticated: boolean;
  User: CurrentUser | null;
  SignIn(email: string, password: string): Promise<void>;
  SignOut(): Promise<void>;
  RefreshMe(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  const refreshMe = useCallback(async (): Promise<void> => {
    const tokens = getAuthTokens();

    if (!tokens?.AccessToken) {
      setUser(null);
      setInitialized(true);
      return;
    }

    try {
      const response = await axiosInstance.get<CurrentUser>('/auth/me');
      setUser(response.data);
    } catch (error) {
      clearAuthTokens();
      setUser(null);
      console.error('Failed to refresh user session', error);
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<void> => {
      if (!email || !password) {
        throw new Error(tAuth('required'));
      }

      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        email,
        password
      });

      const tokens: AuthTokens = {
        AccessToken: response.data.accessToken,
        RefreshToken: response.data.refreshToken
      };

      setAuthTokens(tokens);
      await refreshMe();
      navigate('/');
    },
    [navigate, refreshMe]
  );

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.warn('Sign out request failed', error);
    } finally {
      clearAuthTokens();
      setUser(null);
      globalNavigate('/login');
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      IsAuthenticated: Boolean(user),
      User: user,
      SignIn: signIn,
      SignOut: signOut,
      RefreshMe: refreshMe
    }),
    [refreshMe, signIn, signOut, user]
  );

  if (!initialized) {
    return <div>{tAuth('title')}</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
