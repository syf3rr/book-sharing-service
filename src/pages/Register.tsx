import { useState } from 'react'
import { Alert, Box, Button, Stack, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants'
import { formatError } from '../utils/helpers'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(name, email, password, isAdmin)
      navigate(ROUTES.HOME)
    } catch (err: any) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxWidth={420} component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5">Register</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
        <FormControlLabel
          control={
            <Checkbox
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              color="primary"
            />
          }
          label="Стати адміном"
        />
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
        <Typography variant="body2">Already have an account? <RouterLink to={ROUTES.LOGIN}>Login</RouterLink></Typography>
      </Stack>
    </Box>
  )
}


