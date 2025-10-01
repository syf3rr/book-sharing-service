import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { fetchBook, fetchMyBooks, sendExchangeRequest } from '../services/bookService'
import type { Book } from '../types'

export function useBookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const user = useAuthStore(s => s.user)
  const token = useAuthStore(s => s.token)

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false)
  const [myBooks, setMyBooks] = useState<Book[]>([])
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [exchangeLoading, setExchangeLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    if (!bookId) {
      setError('Book ID is required')
      setLoading(false)
      return
    }
    const fetchBook = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchBook(bookId)
        setBook(data.book)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch book details')
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [bookId])

  const handleExchangeRequest = async () => {
    if (!user || !token || !book) {
      setSnackbarMessage('Please log in to request an exchange')
      setSnackbarOpen(true)
      return
    }
    if (book.owner && book.owner.id === user.id) {
      setSnackbarMessage('You cannot request an exchange for your own book')
      setSnackbarOpen(true)
      return
    }
    try {
      setExchangeLoading(true)
      const myBooksResponse = await fetchMyBooks(token)
      setMyBooks(myBooksResponse.books)
      if (myBooksResponse.books.length === 0) {
        setSnackbarMessage('You need to have at least one book to request an exchange')
        setSnackbarOpen(true)
        return
      }
      setSelectedBooks([])
      setExchangeDialogOpen(true)
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to load your books')
      setSnackbarOpen(true)
    } finally {
      setExchangeLoading(false)
    }
  }

  const handleSendExchangeRequest = async () => {
    if (!user || !token || !book) return
    if (selectedBooks.length === 0) {
      setSnackbarMessage('Please select at least one book for exchange')
      setSnackbarOpen(true)
      return
    }
    try {
      setExchangeLoading(true)
      const selectedBooksData = myBooks.filter(b => selectedBooks.includes(b.id))
      await sendExchangeRequest(token, {
        bookId: book.id,
        requesterName: user.name,
        requesterEmail: user.email,
        requesterBooks: selectedBooksData,
      })
      setExchangeDialogOpen(false)
      setSnackbarMessage('Exchange request sent successfully!')
      setSnackbarOpen(true)
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to send exchange request')
      setSnackbarOpen(true)
    } finally {
      setExchangeLoading(false)
    }
  }

  const handleBookSelection = (id: string) => {
    setSelectedBooks(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  return {
    user,
    book,
    loading,
    error,
    exchangeDialogOpen,
    myBooks,
    selectedBooks,
    exchangeLoading,
    snackbarOpen,
    snackbarMessage,
    setSnackbarOpen,
    handleExchangeRequest,
    handleSendExchangeRequest,
    handleBookSelection,
  }
}

export type UseBookDetailsPageReturn = ReturnType<typeof useBookDetailsPage>


