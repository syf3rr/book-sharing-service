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
  CardActions,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material'
import { 
  CheckCircle, 
  Cancel, 
  SwapHoriz,
  Person,
  Email,
  Book
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { 
  apiGetExchangeRequests, 
  apiAcceptExchangeRequest, 
  apiRejectExchangeRequest 
} from '../api/client'
import type { ExchangeRequestData } from '../types'

export default function Exchange() {
  const { user, token } = useAuth()
  const [requests, setRequests] = useState<ExchangeRequestData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<ExchangeRequestData | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Please log in to view exchange requests')
      setLoading(false)
      return
    }

    if (user) {
      fetchRequests()
    }
  }, [token, user])

  const fetchRequests = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)
      console.log('Fetching exchange requests...')
      const data = await apiGetExchangeRequests(token)
      console.log('Exchange requests data:', data)
      setRequests(data.requests)
    } catch (err: any) {
      console.error('Error fetching exchange requests:', err)
      setError(err.message || 'Failed to fetch exchange requests')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (requestId: string) => {
    if (!token) return

    try {
      setActionLoading(requestId)
      await apiAcceptExchangeRequest(token, requestId)
      setSnackbarMessage('Exchange request accepted!')
      setSnackbarOpen(true)
      await fetchRequests() // Refresh the list
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to accept request')
      setSnackbarOpen(true)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    if (!token) return

    try {
      setActionLoading(requestId)
      await apiRejectExchangeRequest(token, requestId)
      setSnackbarMessage('Exchange request rejected')
      setSnackbarOpen(true)
      await fetchRequests() // Refresh the list
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to reject request')
      setSnackbarOpen(true)
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewDetails = (request: ExchangeRequestData) => {
    setSelectedRequest(request)
    setDetailsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'accepted': return 'success'
      case 'rejected': return 'error'
      case 'completed': return 'info'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Очікує'
      case 'accepted': return 'Прийнято'
      case 'rejected': return 'Відхилено'
      case 'completed': return 'Завершено'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'accepted': return '✅'
      case 'rejected': return '❌'
      case 'completed': return '🎉'
      default: return '❓'
    }
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
      </Stack>
    )
  }

  if (!user) {
    return (
      <Stack spacing={2}>
        <Alert severity="warning">Please log in to view exchange requests</Alert>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Обмін
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Керуйте заявками на обмін ваших книг
        </Typography>
      </Box>

      {requests.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <SwapHoriz sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Немає заявок на обмін
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Коли хтось захоче обміняти вашу книгу, заявка з'явиться тут
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" component="h2">
                        {request.bookName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        by {request.bookAuthor}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${getStatusIcon(request.status)} ${getStatusText(request.status)}`}
                      color={getStatusColor(request.status) as any}
                      size="small"
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Запит від:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person fontSize="small" />
                      <Typography variant="body2">
                        {request.requesterName} ({request.requesterEmail})
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Пропонує для обміну:
                    </Typography>
                    <Typography variant="body2">
                      {request.requesterBooks.length} книг(и)
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {new Date(request.createdAt).toLocaleString('uk-UA')}
                  </Typography>
                </Stack>
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleViewDetails(request)}
                  startIcon={<Book />}
                >
                  Деталі
                </Button>
                
                {request.status === 'pending' && (
                  <>
                    <Button 
                      size="small" 
                      color="success"
                      onClick={() => handleAccept(request.id)}
                      disabled={actionLoading === request.id}
                      startIcon={actionLoading === request.id ? <CircularProgress size={16} /> : <CheckCircle />}
                    >
                      {actionLoading === request.id ? 'Обробка...' : 'Прийняти'}
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => handleReject(request.id)}
                      disabled={actionLoading === request.id}
                      startIcon={actionLoading === request.id ? <CircularProgress size={16} /> : <Cancel />}
                    >
                      {actionLoading === request.id ? 'Обробка...' : 'Відхилити'}
                    </Button>
                  </>
                )}
                
                {request.status === 'completed' && (
                  <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                    🎉 Обмін завершено! Книги обміняні між користувачами.
                  </Typography>
                )}
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}

      {/* Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Деталі заявки на обмін
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Ваша книга:
                </Typography>
                <Typography variant="body1">
                  <strong>{selectedRequest.bookName}</strong> by {selectedRequest.bookAuthor}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Запит від:
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Person fontSize="small" />
                  <Typography variant="body1">
                    {selectedRequest.requesterName}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" />
                  <Typography variant="body1">
                    {selectedRequest.requesterEmail}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Пропонує для обміну:
                </Typography>
                <List>
                  {selectedRequest.requesterBooks.map((book) => (
                    <ListItem key={book.id}>
                      <ListItemIcon>
                        <Book />
                      </ListItemIcon>
                      <ListItemText
                        primary={book.name}
                        secondary={`by ${book.author}${book.description ? ` - ${book.description}` : ''}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Статус:</strong> {getStatusText(selectedRequest.status)}<br />
                  <strong>Дата створення:</strong> {new Date(selectedRequest.createdAt).toLocaleString('uk-UA')}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Закрити
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
