export interface AuthTokens {
  AccessToken: string;
  RefreshToken: string;
}

const AUTH_STORAGE_KEY = 'app.auth.tokens';

export const getAuthTokens = (): AuthTokens | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthTokens;
  } catch (error) {
    console.error('Failed to parse auth tokens', error);
    return null;
  }
};

export const setAuthTokens = (tokens: AuthTokens): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens));
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
