import { apiGetBook, apiGetMyBooks, apiRequestExchange } from '../api/client'
import type { Book } from '../types'

export async function fetchBook(bookId: string) {
  return apiGetBook(bookId)
}

export async function fetchMyBooks(token: string) {
  return apiGetMyBooks(token)
}

export async function sendExchangeRequest(token: string, payload: { bookId: string; requesterName: string; requesterEmail: string; requesterBooks: Book[] }) {
  return apiRequestExchange(token, payload)
}


