import axios, {
  type AxiosInstance,
  type AxiosRequestHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';
import { clearAuthTokens, getAuthTokens, setAuthTokens, type AuthTokens } from '@/core/auth/authToken';
import { navigate } from '@/app/router/navigator';
import type { PagedResponse } from '@/core/types/api';

interface RequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const versionedBaseUrl = `${apiBaseUrl.replace(/\/$/, '')}/v1`;

const refreshClient: AxiosInstance = axios.create({
  baseURL: versionedBaseUrl,
  timeout: 10000
});

const axiosInstance: AxiosInstance = axios.create({
  baseURL: versionedBaseUrl,
  timeout: 10000
});

interface MockUser {
  Id: string;
  Email: string;
  Name: string;
  Role: string;
}

const mockUsers: MockUser[] = [
  { Id: '1', Email: 'admin@example.com', Name: 'Admin User', Role: 'Administrator' },
  { Id: '2', Email: 'editor@example.com', Name: 'Content Editor', Role: 'Editor' }
];

const buildMockResponse = async <TData>(
  data: TData,
  config: RequestConfig,
  status = 200
): Promise<AxiosResponse<TData>> => {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config
  };
};

const normalizePath = (urlPath?: string): string => {
  if (!urlPath) {
    return '';
  }

  return urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
};

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const requestConfig: RequestConfig = { ...config };
  const headers: AxiosRequestHeaders = { ...(requestConfig.headers ?? {}) };
  const tokens = getAuthTokens();

  if (tokens?.AccessToken) {
    headers.Authorization = `Bearer ${tokens.AccessToken}`;
  }

  requestConfig.headers = headers;

  if (enableMock) {
    const path = normalizePath(requestConfig.url);
    const method = (requestConfig.method ?? 'get').toLowerCase();

    if (method === 'post' && path === '/auth/login') {
      const mockTokens: RefreshResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      };

      requestConfig.adapter = async () => buildMockResponse(mockTokens, requestConfig);
    }

    if (method === 'post' && path === '/auth/refresh') {
      const refreshed: RefreshResponse = {
        accessToken: 'mock-access-token-refreshed',
        refreshToken: 'mock-refresh-token-refreshed'
      };

      requestConfig.adapter = async () => buildMockResponse(refreshed, requestConfig);
    }

    if (method === 'get' && path === '/auth/me') {
      const mockUser = {
        Id: '1',
        Email: 'admin@example.com',
        Name: 'Admin User'
      };

      requestConfig.adapter = async () => buildMockResponse(mockUser, requestConfig);
    }

    if (method === 'post' && path === '/auth/logout') {
      requestConfig.adapter = async () => buildMockResponse({}, requestConfig);
    }

    if (method === 'get' && path === '/users') {
      const result: PagedResponse<MockUser> = {
        data: mockUsers,
        total: mockUsers.length
      };

      requestConfig.adapter = async () => buildMockResponse(result, requestConfig);
    }

    if (method === 'delete' && path.startsWith('/users/')) {
      requestConfig.adapter = async () => buildMockResponse({}, requestConfig);
    }
  }

  return requestConfig;
});

let refreshPromise: Promise<AuthTokens | null> | null = null;

const performRefresh = async (): Promise<AuthTokens | null> => {
  const existingTokens = getAuthTokens();

  if (!existingTokens?.RefreshToken) {
    return null;
  }

  if (enableMock) {
    const mockTokens: AuthTokens = {
      AccessToken: 'mock-access-token-refreshed',
      RefreshToken: 'mock-refresh-token-refreshed'
    };
    setAuthTokens(mockTokens);
    return mockTokens;
  }

  const response = await refreshClient.post<RefreshResponse>('/auth/refresh', {
    refreshToken: existingTokens.RefreshToken
  });

  const newTokens: AuthTokens = {
    AccessToken: response.data.accessToken,
    RefreshToken: response.data.refreshToken
  };

  setAuthTokens(newTokens);
  return newTokens;
};

const refreshTokens = (): Promise<AuthTokens | null> => {
  if (!refreshPromise) {
    refreshPromise = performRefresh()
      .catch((error) => {
        console.error('Failed to refresh token', error);
        clearAuthTokens();
        navigate('/login');
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const response = error.response;
    const requestConfig = error.config as RequestConfig | undefined;

    if (!response || !requestConfig) {
      return Promise.reject(error);
    }

    if (response.status === 401 && !requestConfig._retry) {
      requestConfig._retry = true;
      const tokens = await refreshTokens();

      if (tokens?.AccessToken) {
        const headers: AxiosRequestHeaders = { ...(requestConfig.headers ?? {}) };
        headers.Authorization = `Bearer ${tokens.AccessToken}`;
        requestConfig.headers = headers;
        return axiosInstance(requestConfig);
      }

      navigate('/login');
    }

    if (response.status === 401) {
      clearAuthTokens();
      navigate('/login');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
