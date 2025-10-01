import { useState, useEffect } from 'react'
import { Alert, Box, Button, CircularProgress, Stack, Typography, Card, CardContent, CardMedia, CardActions } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGetMyBooks, apiDeleteBook, type Book } from '../api/client'

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
      <Button variant="contained" component={RouterLink} to="/me/books/add">Add New Book</Button>
      {error && <Alert severity="error">{error}</Alert>}
      {loading && <CircularProgress />}
      {!loading && books.length === 0 && <Alert severity="info">You have no books yet. Add one!</Alert>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {books.map(book => (
          <Card key={book.id} sx={{ width: 200 }}>
            {book.photoUrl && <CardMedia component="img" height="140" image={book.photoUrl} alt={book.name} />}
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">{book.name}</Typography>
              <Typography variant="body2" color="text.secondary">{book.author}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="error" onClick={() => handleDelete(book.id)}>Delete</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Stack>
  )
}
