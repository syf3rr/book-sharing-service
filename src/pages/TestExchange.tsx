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
  Divider,
  Grid
} from '@mui/material'
import type { Book } from '../types'

export default function TestExchange() {
  const [demoBooks, setDemoBooks] = useState<Book[]>([])
  const [testUserBooks, setTestUserBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      
      // Fetch demo user books
      const demoResponse = await fetch('http://localhost:4000/api/users/demo/books')
      const demoData = await demoResponse.json()
      setDemoBooks(demoData.books || [])
      
      // Fetch test user books
      const testResponse = await fetch('http://localhost:4000/api/users/test-user/books')
      const testData = await testResponse.json()
      setTestUserBooks(testData.books || [])
      
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Тест обміну книг
      </Typography>
      
      <Alert severity="info">
        Ця сторінка показує стан книг до та після обміну. 
        Перейдіть на вкладку "Обмін" та прийміть заявку, щоб побачити, як книги обмінюються.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Книги Demo користувача (ID: demo)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Кількість книг: {demoBooks.length}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                {demoBooks.map((book) => (
                  <Box key={book.id} sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {book.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      by {book.author}
                    </Typography>
                    {book.description && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {book.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Книги Test користувача (ID: test-user)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Кількість книг: {testUserBooks.length}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                {testUserBooks.map((book) => (
                  <Box key={book.id} sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {book.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      by {book.author}
                    </Typography>
                    {book.description && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {book.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box textAlign="center">
        <Button 
          variant="contained" 
          onClick={fetchBooks}
          startIcon={<CircularProgress size={16} />}
        >
          Оновити дані
        </Button>
      </Box>
    </Stack>
  )
}
