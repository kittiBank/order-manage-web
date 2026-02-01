export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    PROFILE: '/api/v1/auth/profile',
  },
  ORDERS: {
    LIST: '/api/v1/orders',
    CREATE: '/api/v1/orders',
    GET: (id: string) => `/api/v1/orders/${id}`,
    UPDATE: (id: string) => `/api/v1/orders/${id}`,
    DELETE: (id: string) => `/api/v1/orders/${id}`,
    BULK_UPDATE: '/api/v1/orders/bulk',
  },
};
