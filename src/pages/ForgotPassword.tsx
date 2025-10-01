import React, { useState } from 'react'
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
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useApiClient } from '../hooks/useApiClient'
import { API_ENDPOINTS, ROUTES } from '../constants'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const api = useApiClient()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setMessage({ type: 'error', text: 'Будь ласка, введіть email' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
      setEmailSent(true)
      setMessage({ 
        type: 'success', 
        text: 'Повідомлення з інструкціями для відновлення паролю відправлено на вашу електронну пошту' 
      })
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Помилка при відправці повідомлення' 
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
              Відновлення паролю
            </Typography>
            
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
              Введіть вашу електронну адресу, і ми надішлемо вам посилання для відновлення паролю
            </Typography>

            {message && (
              <Alert severity={message.type} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )}

            {!emailSent ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Електронна адреса"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Відправити'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Повідомлення відправлено!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Перевірте свою електронну пошту та перейдіть за посиланням для встановлення нового паролю
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  sx={{ mr: 2 }}
                >
                  Повернутися до входу
                </Button>
              </Box>
            )}

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
