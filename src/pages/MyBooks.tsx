import { useState, useEffect } from 'react'
import { Alert, Box, Button, CircularProgress, Stack, Typography, Grid } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGetMyBooks, apiDeleteBook } from '../api/client'
import type { Book } from '../types'
import { ROUTES } from '../constants'
import BookCard from '../components/BookCard'

export default function MyBooks() {
  const { token } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooks() {
      if (!token) return
      try {
        setLoading(true)
        const res = await apiGetMyBooks(token)
        setBooks(res.books)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch books')
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [token])

  async function handleDelete(bookId: string) {
    if (!token) return
    try {
      await apiDeleteBook(token, bookId)
      setBooks(prev => prev.filter(book => book.id !== bookId))
    } catch (err: any) {
      setError(err.message || 'Failed to delete book')
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">My Books</Typography>
      <Button variant="contained" component={RouterLink} to={ROUTES.ADD_BOOK}>Add New Book</Button>
      {error && <Alert severity="error">{error}</Alert>}
      {loading && <CircularProgress />}
      {!loading && books.length === 0 && <Alert severity="info">You have no books yet. Add one!</Alert>}
      <Grid container spacing={3}>
        {books.map(book => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <BookCard 
              book={book} 
              onViewDetails={() => {}} 
              showActions={false}
            />
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
              <Button 
                size="small" 
                color="error" 
                onClick={() => handleDelete(book.id)}
                variant="outlined"
              >
                Delete
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
