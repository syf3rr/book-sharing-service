export interface User {
  id: string
  email: string
  role: string
  name: string
}

export interface Book {
  id: string
  name: string
  author: string
  photoUrl: string | null
  description?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface BooksResponse {
  books: Book[]
  pagination: {
    currentPage: number
    totalPages: number
    totalBooks: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface BookSearchParams {
  search?: string
  sort?: 'name' | 'author'
  page?: number
  limit?: number
}

export interface AddBookParams {
  name: string
  author: string
  photoUrl?: string
  description?: string
}

export interface ExchangeRequest {
  bookId: string
  requesterName: string
  requesterEmail: string
  requesterBooks: Book[]
}

export interface ExchangeRequestResponse {
  success: boolean
  message: string
}

export interface ExchangeRequestData {
  id: string
  bookId: string
  bookName: string
  bookAuthor: string
  requesterId: string
  requesterName: string
  requesterEmail: string
  requesterBooks: Book[]
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  createdAt: string
}

export interface ExchangeRequestsResponse {
  requests: ExchangeRequestData[]
}