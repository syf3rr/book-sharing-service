import { Box, Card, CardActions, CardContent, Chip, Typography, Button, CircularProgress } from '@mui/material'
import { CheckCircle, Cancel, Book } from '@mui/icons-material'
import type { ExchangeRequestData } from '../../types'

interface Props {
  request: ExchangeRequestData
  actionLoading: boolean
  onDetails: (request: ExchangeRequestData) => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  getStatusColor: (status: string) => any
  getStatusText: (status: string) => string
}

export default function RequestCard({ request, actionLoading, onDetails, onAccept, onReject, getStatusColor, getStatusText }: Props) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" component="h2">{request.bookName}</Typography>
            <Typography variant="body2" color="text.secondary">by {request.bookAuthor}</Typography>
          </Box>
          <Chip label={`${getStatusText(request.status)}`} color={getStatusColor(request.status)} size="small" />
        </Box>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>Запит від:</Typography>
          <Typography variant="body2">{request.requesterName} ({request.requesterEmail})</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>Пропонує для обміну:</Typography>
          <Typography variant="body2">{request.requesterBooks.length} книг(и)</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">{new Date(request.createdAt).toLocaleString('uk-UA')}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onDetails(request)} startIcon={<Book />}>Деталі</Button>
        {request.status === 'pending' && (
          <>
            <Button size="small" color="success" onClick={() => onAccept(request.id)} disabled={actionLoading} startIcon={actionLoading ? <CircularProgress size={16} /> : <CheckCircle />}> {actionLoading ? 'Обробка...' : 'Прийняти'} </Button>
            <Button size="small" color="error" onClick={() => onReject(request.id)} disabled={actionLoading} startIcon={actionLoading ? <CircularProgress size={16} /> : <Cancel />}> {actionLoading ? 'Обробка...' : 'Відхилити'} </Button>
          </>
        )}
      </CardActions>
    </Card>
  )
}


