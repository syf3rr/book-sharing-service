const API_BASE_URL = 'http://localhost:4000'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/login`,
    REGISTER: `${API_BASE_URL}/api/register`,
    ME: `${API_BASE_URL}/api/me`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/reset-password`,
  },
  BOOKS: {
    LIST: `${API_BASE_URL}/api/books`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/books/${id}`,
    MY_BOOKS: `${API_BASE_URL}/api/me/books`,
    ADD: `${API_BASE_URL}/api/me/books`,
    DELETE: (id: string) => `${API_BASE_URL}/api/me/books/${id}`,
    EXCHANGE_REQUEST: `${API_BASE_URL}/api/books/exchange-request`,
  },
  EXCHANGE: {
    REQUESTS: `${API_BASE_URL}/api/exchange/requests`,
    ACCEPT: (id: string) => `${API_BASE_URL}/api/exchange/requests/${id}/accept`,
    REJECT: (id: string) => `${API_BASE_URL}/api/exchange/requests/${id}/reject`,
  },
  ADMIN: {
    USERS: `${API_BASE_URL}/api/admin/users`,
    BOOKS: `${API_BASE_URL}/api/admin/books`,
    DELETE_BOOK: (id: string) => `${API_BASE_URL}/api/admin/books/${id}`,
    DELETE_USER: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
    UPDATE_USER_ROLE: (id: string) => `${API_BASE_URL}/api/admin/users/${id}/role`,
  },
  PROFILE: {
    UPDATE: `${API_BASE_URL}/api/me/profile`,
    UPLOAD_AVATAR: `${API_BASE_URL}/api/me/avatar`,
    EXCHANGE_REQUESTS: `${API_BASE_URL}/api/me/exchange-requests`,
  },
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BOOKS: '/books',
  BOOK_DETAIL: (id: string) => `/books/${id}`,
  MY_BOOKS: '/me/books',
  ADD_BOOK: '/me/books/add',
  EXCHANGE: '/exchange',
  TEST_EXCHANGE: '/test-exchange',
  ADMIN: '/admin',
  PROFILE: '/profile',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const

export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
} as const
