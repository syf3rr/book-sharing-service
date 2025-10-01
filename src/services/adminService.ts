import { apiGetAllUsers, apiGetAllBooks, apiDeleteUser, apiDeleteAnyBook, apiUpdateUserRole } from '../api/client'
import type { User, Book } from '../types'

export async function fetchAdminOverview(token: string): Promise<{ users: User[]; books: Book[] }> {
  const [usersRes, booksRes] = await Promise.all([
    apiGetAllUsers(token),
    apiGetAllBooks(token),
  ])
  return { users: usersRes.users, books: booksRes.books }
}

export async function removeUser(token: string, userId: string): Promise<void> {
  await apiDeleteUser(token, userId)
}

export async function removeBook(token: string, bookId: string): Promise<void> {
  await apiDeleteAnyBook(token, bookId)
}

export async function changeUserRole(token: string, userId: string, role: 'admin' | 'user'): Promise<User> {
  const res = await apiUpdateUserRole(token, userId, role)
  return res.user
}


