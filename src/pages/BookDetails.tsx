import { useState, useEffect } from 'react'
import { 
  Alert, 
  Box, 
  Button, 
  CircularProgress, 
  Stack, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Snackbar
} from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { apiGetBook, apiRequestExchange, apiGetMyBooks } from '../api/client'
import type { Book } from '../types'
import { ROUTES } from '../constants'
import { useAuth } from '../context/AuthContext'

export default function BookDetails() {
  const { bookId } = useParams<{ bookId: string }>()
  const { user, token } = useAuth()
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
        const data = await apiGetBook(bookId)
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

    try {
      setExchangeLoading(true)
      
      // Get user's books
      const myBooksResponse = await apiGetMyBooks(token)
      setMyBooks(myBooksResponse.books)
      
      if (myBooksResponse.books.length === 0) {
        setSnackbarMessage('You need to have at least one book to request an exchange')
        setSnackbarOpen(true)
        return
      }
      
      // Reset selected books
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
      
      const selectedBooksData = myBooks.filter(book => selectedBooks.includes(book.id))
      
      await apiRequestExchange(token, {
        bookId: book.id,
        requesterName: user.name,
        requesterEmail: user.email,
        requesterBooks: selectedBooksData
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

  const handleBookSelection = (bookId: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    )
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{error}</Alert>
        <Button component={RouterLink} to="/books" variant="outlined">
          Back to Books
        </Button>
      </Stack>
    )
  }

  if (!book) {
    return (
      <Stack spacing={2}>
        <Alert severity="warning">Book not found</Alert>
        <Button component={RouterLink} to="/books" variant="outlined">
          Back to Books
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      {/* Back Button */}
      <Button 
        component={RouterLink} 
        to={ROUTES.BOOKS} 
        variant="outlined"
        sx={{ alignSelf: 'flex-start' }}
      >
        ← Back to Books
      </Button>

      {/* Book Details Card */}
      <Card sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Book Cover */}
          {book.photoUrl && (
            <Box sx={{ minWidth: 300, maxWidth: 400 }}>
              <CardMedia
                component="img"
                height="400"
                image={book.photoUrl}
                alt={book.name}
                sx={{ 
                  objectFit: 'cover',
                  borderRadius: 1
                }}
              />
            </Box>
          )}

          {/* Book Info */}
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h4" component="h1" gutterBottom>
                {book.name}
              </Typography>
              
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Author
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {book.author}
                </Typography>
              </Box>

              {book.description && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {book.description}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider />

              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Book ID
                </Typography>
                <Chip label={book.id} variant="outlined" />
              </Box>

              {book.photoUrl && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Cover Image
                    </Typography>
                    <Button 
                      variant="outlined" 
                      href={book.photoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Full Image
                    </Button>
                  </Box>
                </>
              )}

              <Divider />

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button 
                  component={RouterLink} 
                  to={ROUTES.BOOKS} 
                  variant="outlined"
                >
                  Browse More Books
                </Button>
                <Button 
                  component={RouterLink} 
                  to={ROUTES.MY_BOOKS} 
                  variant="outlined"
                >
                  My Books
                </Button>
                {user && (
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={handleExchangeRequest}
                    disabled={exchangeLoading}
                    startIcon={exchangeLoading ? <CircularProgress size={20} /> : null}
                  >
                    {exchangeLoading ? 'Loading...' : 'Запросити обмін'}
                  </Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Stack>
      </Card>

      {/* Additional Info */}
      <Card sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            About This Book
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This book is part of our community library. You can find more books by the same author 
            or explore other titles in our collection. If you're interested in sharing your own books, 
            you can add them to your personal collection.
          </Typography>
        </CardContent>
      </Card>

      {/* Exchange Request Dialog */}
      <Dialog 
        open={exchangeDialogOpen} 
        onClose={() => setExchangeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Запросити обмін на "{book?.name}"
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body1">
              Ви хочете обміняти цю книгу на одну з ваших книг. 
              Власник книги отримає email з вашими даними та списком вибраних книг.
            </Typography>
            
            <Typography variant="h6">
              Оберіть книги для обміну:
            </Typography>
            
            <List>
              {myBooks.map((myBook) => (
                <ListItem key={myBook.id} button onClick={() => handleBookSelection(myBook.id)}>
                  <ListItemIcon>
                    <Checkbox
                      checked={selectedBooks.includes(myBook.id)}
                      onChange={() => handleBookSelection(myBook.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={myBook.name}
                    secondary={`by ${myBook.author}${myBook.description ? ` - ${myBook.description}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
            
            {selectedBooks.length > 0 && (
              <Typography variant="body2" color="primary">
                Вибрано книг: {selectedBooks.length}
              </Typography>
            )}
            
            <Typography variant="body2" color="text.secondary">
              <strong>Ваше ім'я:</strong> {user?.name}<br />
              <strong>Ваш email:</strong> {user?.email}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExchangeDialogOpen(false)}>
            Скасувати
          </Button>
          <Button 
            onClick={handleSendExchangeRequest}
            variant="contained"
            disabled={exchangeLoading || selectedBooks.length === 0}
            startIcon={exchangeLoading ? <CircularProgress size={20} /> : null}
          >
            {exchangeLoading ? 'Відправка...' : 'Відправити запит'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Stack>
  )
}
