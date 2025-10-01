import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Container,
} from '@mui/material'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useApiClient } from '../hooks/useApiClient'
import { API_ENDPOINTS, ROUTES } from '../constants'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const api = useApiClient()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Недійсне посилання для відновлення паролю' })
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setMessage({ type: 'error', text: 'Недійсне посилання для відновлення паролю' })
      return
    }

    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Будь ласка, заповніть всі поля' })
      return
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Паролі не співпадають' })
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Пароль повинен містити принаймні 6 символів' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { 
        token, 
        newPassword: password 
      })
      setMessage({ 
        type: 'success', 
        text: 'Пароль успішно змінено! Тепер ви можете увійти з новим паролем.' 
      })
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN)
      }, 3000)
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Помилка при зміні паролю' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Встановлення нового паролю
            </Typography>
            
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Введіть новий пароль для вашого облікового запису
            </Typography>

            {message && (
              <Alert severity={message.type} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Новий пароль"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Підтвердження паролю"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !token}
              >
                {loading ? <CircularProgress size={24} /> : 'Змінити пароль'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
                Повернутися до входу
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
