export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    ME: '/api/me',
  },
  BOOKS: {
    LIST: '/api/books',
    DETAIL: (id: string) => `/api/books/${id}`,
    MY_BOOKS: '/api/me/books',
    ADD: '/api/me/books',
    DELETE: (id: string) => `/api/me/books/${id}`,
    EXCHANGE_REQUEST: '/api/books/exchange-request',
  },
  EXCHANGE: {
    REQUESTS: '/api/exchange/requests',
    ACCEPT: (id: string) => `/api/exchange/requests/${id}/accept`,
    REJECT: (id: string) => `/api/exchange/requests/${id}/reject`,
  },
  ADMIN: {
    USERS: '/api/admin/users',
    BOOKS: '/api/admin/books',
    DELETE_BOOK: (id: string) => `/api/admin/books/${id}`,
    DELETE_USER: (id: string) => `/api/admin/users/${id}`,
    UPDATE_USER_ROLE: (id: string) => `/api/admin/users/${id}/role`,
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
} as const

export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
} as const
