import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { fetchAdminOverview, removeUser, removeBook, changeUserRole } from '../services/adminService'
import type { User, Book } from '../types'

export function useAdminPanel() {
  const user = useAuthStore(s => s.user)
  const token = useAuthStore(s => s.token)

  const [users, setUsers] = useState<User[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user')
  const [deleteBookDialogOpen, setDeleteBookDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)

  const fetchData = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      setError(null)
      const { users: u, books: b } = await fetchAdminOverview(token)
      setUsers(u)
      setBooks(b)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.')
      setLoading(false)
      return
    }
    fetchData()
  }, [user, fetchData])

  const openDeleteUserDialog = (userItem: User) => {
    setUserToDelete(userItem)
    setDeleteUserDialogOpen(true)
  }

  const openRoleDialog = (userItem: User) => {
    setUserToUpdate(userItem)
    setNewRole(userItem.role as 'admin' | 'user')
    setRoleDialogOpen(true)
  }

  const openDeleteBookDialog = (book: Book) => {
    setBookToDelete(book)
    setDeleteBookDialogOpen(true)
  }

  const handleDeleteUser = async () => {
    if (!token || !userToDelete) return
    try {
      await removeUser(token, userToDelete.id)
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
      setSnackbarMessage('User deleted successfully')
      setSnackbarOpen(true)
      setDeleteUserDialogOpen(false)
      setUserToDelete(null)
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to delete user')
      setSnackbarOpen(true)
    }
  }

  const handleDeleteBook = async () => {
    if (!token || !bookToDelete) return
    try {
      await removeBook(token, bookToDelete.id)
      setBooks(prev => prev.filter(b => b.id !== bookToDelete.id))
      setSnackbarMessage('Book deleted successfully')
      setSnackbarOpen(true)
      setDeleteBookDialogOpen(false)
      setBookToDelete(null)
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to delete book')
      setSnackbarOpen(true)
    }
  }

  const handleUpdateRole = async () => {
    if (!token || !userToUpdate) return
    try {
      const updated = await changeUserRole(token, userToUpdate.id, newRole)
      setUsers(prev => prev.map(u => (u.id === userToUpdate.id ? updated : u)))
      setSnackbarMessage('User role updated successfully')
      setSnackbarOpen(true)
      setRoleDialogOpen(false)
      setUserToUpdate(null)
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to update user role')
      setSnackbarOpen(true)
    }
  }

  return {
    // auth
    user,
    // data
    users,
    books,
    loading,
    error,
    // dialogs & selections
    deleteUserDialogOpen,
    userToDelete,
    roleDialogOpen,
    userToUpdate,
    newRole,
    deleteBookDialogOpen,
    bookToDelete,
    // actions
    setSnackbarOpen,
    setNewRole,
    setDeleteUserDialogOpen,
    setRoleDialogOpen,
    setDeleteBookDialogOpen,
    openDeleteUserDialog,
    openRoleDialog,
    openDeleteBookDialog,
    handleDeleteUser,
    handleDeleteBook,
    handleUpdateRole,
    // feedback
    snackbarOpen,
    snackbarMessage,
  }
}

export type UseAdminPanelReturn = ReturnType<typeof useAdminPanel>


