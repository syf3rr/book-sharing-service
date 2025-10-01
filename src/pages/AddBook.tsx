import { useState } from 'react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiAddBook } from '../api/client'
import { ROUTES } from '../constants'
import { formatError } from '../utils/helpers'

export default function AddBook() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    if (!token) {
      setError('Not authenticated')
      setLoading(false)
      return
    }
    try {
      await apiAddBook(token, { name, author, photoUrl: photoUrl || undefined, description: description || undefined })
      navigate(ROUTES.MY_BOOKS)
    } catch (err: any) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxWidth={420} component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5">Add New Book</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Book Name" type="text" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
        <TextField label="Author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} fullWidth required />
        <TextField label="Photo URL" type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} fullWidth />
        <TextField 
          label="Description" 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          fullWidth 
          multiline 
          rows={4}
          placeholder="Describe the book, its condition, why you want to exchange it..."
        />
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Adding...' : 'Add Book'}</Button>
        <Button component={RouterLink} to={ROUTES.MY_BOOKS} variant="outlined">Cancel</Button>
      </Stack>
    </Box>
  )
}

