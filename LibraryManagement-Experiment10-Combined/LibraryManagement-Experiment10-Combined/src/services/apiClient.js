import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'libraryAuthToken';
export const TOKEN_EXPIRY_KEY = 'libraryAuthExpiresAt';
export const AUTH_STORAGE_KEY = 'libraryManagementAuth';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 12000,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    // A delayed 401 must not clear a newer token from another login.
    config.__libraryAuthToken = token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status || 0;
    const config = error?.config || {};

    const failedToken = config.__libraryAuthToken;
    const url = String(config.url || '');
    const isLoginOrRegistration = /\/auth\/(login|register)$/.test(url);
    if (status === 401 && failedToken && !isLoginOrRegistration && typeof window !== 'undefined') {
      const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (currentToken === failedToken) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('library:session-expired', {
          detail: { token: failedToken, message: error?.response?.data?.message || 'Your session is invalid or expired. Please sign in again.' },
        }));
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
