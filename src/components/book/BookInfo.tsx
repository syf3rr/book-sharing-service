import { Box, Chip, Divider, Typography, Button } from '@mui/material'

interface Props {
  name: string
  author: string
  description?: string | null
  idLabel: string
  coverUrl?: string | null
}

export default function BookInfo({ name, author, description, idLabel, coverUrl }: Props) {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>{name}</Typography>
      <Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>Author</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{author}</Typography>
      </Box>
      {description && (
        <>
          <Divider />
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>Description</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{description}</Typography>
          </Box>
        </>
      )}
      <Divider />
      <Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>Book ID</Typography>
        <Chip label={idLabel} variant="outlined" />
      </Box>
      {coverUrl && (
        <>
          <Divider />
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>Cover Image</Typography>
            <Button variant="outlined" href={coverUrl || undefined} target="_blank" rel="noopener noreferrer">View Full Image</Button>
          </Box>
        </>
      )}
    </Box>
  )
}
