import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import type { ExchangeRequestData } from '../../types'

interface Props {
  requests: ExchangeRequestData[]
  onOpenDetails: (request: ExchangeRequestData) => void
  getStatusColor: (status: string) => any
  getStatusText: (status: string) => string
}

export default function ExchangeRequestsList({ requests, onOpenDetails, getStatusColor, getStatusText }: Props) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Запити на обмін ({requests.length})</Typography>
        </Box>

        {requests.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Немає активних запитів на обмін
          </Typography>
        ) : (
          <List>
            {requests.map((request) => (
              <ListItem key={request.id} divider>
                <ListItemText
                  primary={`${request.bookName} - ${request.bookAuthor}`}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Від: {request.requesterName} ({request.requesterEmail})
                      </Typography>
                      <Chip label={getStatusText(request.status)} color={getStatusColor(request.status)} size="small" sx={{ mt: 1 }} />
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => onOpenDetails(request)} size="small">
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
