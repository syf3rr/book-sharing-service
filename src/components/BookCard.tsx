import { Card, CardContent, CardMedia, CardActions, Button, Typography } from '@mui/material'
import type { Book } from '../types'

interface BookCardProps {
  book: Book
  onViewDetails: (bookId: string) => void
  showActions?: boolean
}

export default function BookCard({ book, onViewDetails, showActions = true }: BookCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      onClick={() => onViewDetails(book.id)}
    >
      {book.photoUrl && (
        <CardMedia
          component="img"
          height="200"
          image={book.photoUrl}
          alt={book.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {book.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          by {book.author}
        </Typography>
      </CardContent>
      {showActions && (
        <CardActions>
          <Button size="small" color="primary">
            View Details
          </Button>
        </CardActions>
      )}
    </Card>
  )
}
