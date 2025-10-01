import { Box, Card, CardContent, Grid, Typography, Button, Divider } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import type { Book } from '../../types'

interface Props {
  books: Book[]
  onDelete: (book: Book) => void
}

export function BooksGrid({ books, onDelete }: Props) {
  return (
    <Grid container spacing={2}>
      {books.map((book) => (
        <Grid item xs={12} sm={6} md={4} key={book.id}>
          <Card variant="outlined">
            {book.photoUrl && (
              <Box
                component="img"
                sx={{ height: 200, width: '100%', objectFit: 'cover' }}
                src={book.photoUrl}
                alt={book.name}
              />
            )}
            <CardContent>
              <Typography variant="h6" noWrap>
                {book.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                by {book.author}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" display="block">
                Owner: {(book as any).ownerName || 'Unknown'}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                {(book as any).ownerEmail || 'Unknown'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDelete(book)}
                  fullWidth
                >
                  Delete Book
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default BooksGrid


