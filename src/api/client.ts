import { API_ENDPOINTS } from '../constants'
import type { AuthResponse, Book, BooksResponse, BookSearchParams, AddBookParams, ExchangeRequest, ExchangeRequestResponse, ExchangeRequestData, ExchangeRequestsResponse } from '../types'
import { isNetworkError } from '../utils/helpers'

const defaultHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
})

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await parseJsonSafe<{ error?: string }>(res)
    if (data && data.error) return data.error
    const text = await res.text()
    return text || fallback
  } catch {
    return fallback
  }
}

export async function apiRegister(name: string, email: string, password: string, isAdmin?: boolean): Promise<AuthResponse> {
  try {
    const requestBody = { name, email, password, isAdmin }
    console.log('API Register - Sending request body:', requestBody)
    const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(requestBody),
    })
    if (!res.ok) throw new Error(await readErrorMessage(res, 'Registration failed'))
    const data = await parseJsonSafe<AuthResponse>(res)
    if (!data) throw new Error('Registration failed: empty response')
    return data
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error('Network error: Please check if the server is running')
    }
    throw error
  }
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error(await readErrorMessage(res, 'Login failed'))
    const data = await parseJsonSafe<AuthResponse>(res)
    if (!data) throw new Error('Login failed: empty response')
    return data
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error('Network error: Please check if the server is running')
    }
    throw error
  }
}

export async function apiMe(token: string): Promise<{ user: AuthResponse['user'] }> {
  const res = await fetch(API_ENDPOINTS.AUTH.ME, {
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Unauthorized'))
  const data = await parseJsonSafe<{ user: AuthResponse['user'] }>(res)
  if (!data) throw new Error('Unauthorized: empty response')
  return data
}

export async function apiGetMyBooks(token: string): Promise<{ books: Book[] }> {
  const res = await fetch(API_ENDPOINTS.BOOKS.MY_BOOKS, {
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to fetch books'))
  const data = await parseJsonSafe<{ books: Book[] }>(res)
  if (!data) throw new Error('Failed to fetch books: empty response')
  return data
}

export async function apiAddBook(token: string, book: AddBookParams): Promise<{ book: Book }> {
  const res = await fetch(API_ENDPOINTS.BOOKS.ADD, {
    method: 'POST',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(book),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to add book'))
  const data = await parseJsonSafe<{ book: Book }>(res)
  if (!data) throw new Error('Failed to add book: empty response')
  return data
}

export async function apiDeleteBook(token: string, bookId: string): Promise<void> {
  const res = await fetch(API_ENDPOINTS.BOOKS.DELETE(bookId), {
    method: 'DELETE',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to delete book'))
}

export async function apiGetBooks(params: BookSearchParams): Promise<BooksResponse> {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())

  const res = await fetch(`${API_ENDPOINTS.BOOKS.LIST}?${searchParams.toString()}`)
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to fetch books'))
  const data = await parseJsonSafe<BooksResponse>(res)
  if (!data) throw new Error('Failed to fetch books: empty response')
  return data
}

export async function apiGetBook(bookId: string): Promise<{ book: Book }> {
  const res = await fetch(API_ENDPOINTS.BOOKS.DETAIL(bookId))
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to fetch book'))
  const data = await parseJsonSafe<{ book: Book }>(res)
  if (!data) throw new Error('Failed to fetch book: empty response')
  return data
}

export async function apiRequestExchange(token: string, request: ExchangeRequest): Promise<ExchangeRequestResponse> {
  const res = await fetch(API_ENDPOINTS.BOOKS.EXCHANGE_REQUEST, {
    method: 'POST',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to send exchange request'))
  const data = await parseJsonSafe<ExchangeRequestResponse>(res)
  if (!data) throw new Error('Failed to send exchange request: empty response')
  return data
}

export async function apiGetExchangeRequests(token: string): Promise<ExchangeRequestsResponse> {
  try {
    const res = await fetch(API_ENDPOINTS.EXCHANGE.REQUESTS, {
      headers: {
        ...defaultHeaders(),
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to fetch exchange requests'))
    const data = await parseJsonSafe<ExchangeRequestsResponse>(res)
    if (!data) throw new Error('Failed to fetch exchange requests: empty response')
    return data
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error('Network error: Please check if the server is running')
    }
    throw error
  }
}

export async function apiAcceptExchangeRequest(token: string, requestId: string): Promise<ExchangeRequestResponse> {
  const res = await fetch(API_ENDPOINTS.EXCHANGE.ACCEPT(requestId), {
    method: 'POST',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to accept exchange request'))
  const data = await parseJsonSafe<ExchangeRequestResponse>(res)
  if (!data) throw new Error('Failed to accept exchange request: empty response')
  return data
}

export async function apiRejectExchangeRequest(token: string, requestId: string): Promise<ExchangeRequestResponse> {
  const res = await fetch(API_ENDPOINTS.EXCHANGE.REJECT(requestId), {
    method: 'POST',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to reject exchange request'))
  const data = await parseJsonSafe<ExchangeRequestResponse>(res)
  if (!data) throw new Error('Failed to reject exchange request: empty response')
  return data
}

// Admin API functions
export async function apiGetAllUsers(token: string): Promise<{ users: User[] }> {
  const res = await fetch(API_ENDPOINTS.ADMIN.USERS, {
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to fetch users'))
  const data = await parseJsonSafe<{ users: User[] }>(res)
  if (!data) throw new Error('Failed to fetch users: empty response')
  return data
}

export async function apiGetAllBooks(token: string): Promise<{ books: Book[] }> {
  const res = await fetch(API_ENDPOINTS.ADMIN.BOOKS, {
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to fetch books'))
  const data = await parseJsonSafe<{ books: Book[] }>(res)
  if (!data) throw new Error('Failed to fetch books: empty response')
  return data
}

export async function apiDeleteAnyBook(token: string, bookId: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(API_ENDPOINTS.ADMIN.DELETE_BOOK(bookId), {
    method: 'DELETE',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to delete book'))
  const data = await parseJsonSafe<{ success: boolean; message: string }>(res)
  if (!data) throw new Error('Failed to delete book: empty response')
  return data
}

export async function apiDeleteUser(token: string, userId: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(API_ENDPOINTS.ADMIN.DELETE_USER(userId), {
    method: 'DELETE',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to delete user'))
  const data = await parseJsonSafe<{ success: boolean; message: string }>(res)
  if (!data) throw new Error('Failed to delete user: empty response')
  return data
}

export async function apiUpdateUserRole(token: string, userId: string, role: 'admin' | 'user'): Promise<{ success: boolean; message: string; user: User }> {
  const res = await fetch(API_ENDPOINTS.ADMIN.UPDATE_USER_ROLE(userId), {
    method: 'PUT',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to update user role'))
  const data = await parseJsonSafe<{ success: boolean; message: string; user: User }>(res)
  if (!data) throw new Error('Failed to update user role: empty response')
  return data
}


