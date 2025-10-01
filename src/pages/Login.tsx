import { useState } from 'react'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants'
import { formatError } from '../utils/helpers'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
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
        <Typography variant="h5">Login</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
        <Typography variant="body2" align="center">
          <RouterLink to={ROUTES.FORGOT_PASSWORD}>Забули пароль?</RouterLink>
        </Typography>
        <Typography variant="body2">No account? <RouterLink to={ROUTES.REGISTER}>Register</RouterLink></Typography>
      </Stack>
    </Box>
  )
}


