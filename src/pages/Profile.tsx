import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelRequestIcon,
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useApiClient } from '../hooks/useApiClient'
import { API_ENDPOINTS } from '../constants'
import type { UpdateProfileParams, ExchangeRequestData, ChangePasswordParams } from '../types'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const api = useApiClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequestData[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ExchangeRequestData | null>(null)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      })
      setAvatarPreview(user.avatar || null)
    }
  }, [user])

  useEffect(() => {
    fetchExchangeRequests()
  }, [])

  const fetchExchangeRequests = async () => {
    try {
      const response = await api.get<{ requests: ExchangeRequestData[] }>(API_ENDPOINTS.PROFILE.EXCHANGE_REQUESTS)
      setExchangeRequests(response.requests)
    } catch (error) {
      console.error('Error fetching exchange requests:', error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setAvatar(null)
    setAvatarPreview(user?.avatar || null)
  }

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      // Upload avatar if changed
      let avatarUrl = user.avatar
      if (avatar) {
        const formData = new FormData()
        formData.append('avatar', avatar)
        const uploadResponse = await api.post<{ avatarUrl: string }>(API_ENDPOINTS.PROFILE.UPLOAD_AVATAR, formData)
        avatarUrl = uploadResponse.avatarUrl
      }

      // Update profile
      const updateData: UpdateProfileParams = {
        name: formData.name,
        email: formData.email,
        avatar: avatarUrl,
      }

      const response = await api.put<{ user: any }>(API_ENDPOINTS.PROFILE.UPDATE, updateData)
      
      updateUser(response.user)
      setIsEditing(false)
      setMessage({ type: 'success', text: 'Профіль успішно оновлено!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Помилка при оновленні профілю' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChangeInput = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }

  const handleChangePassword = async () => {
    if (!user) return
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setMessage({ type: 'error', text: 'Введіть поточний та новий паролі' })
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Новий пароль має містити щонайменше 6 символів' })
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Паролі не співпадають' })
      return
    }

    setPasswordLoading(true)
    setMessage(null)
    try {
      const payload: ChangePasswordParams = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }
      await api.put<{ message: string }>(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, payload)
      setMessage({ type: 'success', text: 'Пароль успішно змінено' })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Не вдалося змінити пароль' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.post(API_ENDPOINTS.EXCHANGE.ACCEPT(requestId))
      setMessage({ type: 'success', text: 'Запит на обмін прийнято!' })
      fetchExchangeRequests()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Помилка при прийнятті запиту' })
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.post(API_ENDPOINTS.EXCHANGE.REJECT(requestId))
      setMessage({ type: 'success', text: 'Запит на обмін відхилено!' })
      fetchExchangeRequests()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Помилка при відхиленні запиту' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'accepted': return 'success'
      case 'rejected': return 'error'
      case 'completed': return 'info'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Очікує'
      case 'accepted': return 'Прийнято'
      case 'rejected': return 'Відхилено'
      case 'completed': return 'Завершено'
      default: return status
    }
  }

  if (!user) {
    return <CircularProgress />
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Мій профіль
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={avatarPreview || undefined}
                  sx={{ width: 80, height: 80, mr: 2 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography color="text.secondary">{user.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Книг у бібліотеці: {user.booksCount || 0}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {isEditing ? (
                <Box>
                  <TextField
                    fullWidth
                    label="Ім'я"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    margin="normal"
                    type="email"
                  />
                  
                  <Box sx={{ mt: 2 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="avatar-upload"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCameraIcon />}
                        sx={{ mr: 2 }}
                      >
                        Змінити аватар
                      </Button>
                    </label>
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={loading}
                      startIcon={<SaveIcon />}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Зберегти'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      startIcon={<CancelIcon />}
                    >
                      Скасувати
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  onClick={handleEdit}
                  startIcon={<EditIcon />}
                >
                  Редагувати профіль
                </Button>
              )}
            </CardContent>
          </Card>
          {/* Change Password */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Змінити пароль
              </Typography>
              <TextField
                fullWidth
                label="Поточний пароль"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChangeInput('currentPassword')}
                margin="normal"
                autoComplete="current-password"
              />
              <TextField
                fullWidth
                label="Новий пароль"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChangeInput('newPassword')}
                margin="normal"
                autoComplete="new-password"
              />
              <TextField
                fullWidth
                label="Підтвердження нового паролю"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChangeInput('confirmPassword')}
                margin="normal"
                autoComplete="new-password"
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleChangePassword} disabled={passwordLoading}>
                  {passwordLoading ? <CircularProgress size={20} /> : 'Оновити пароль'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Exchange Requests */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Запити на обмін ({exchangeRequests.length})
                </Typography>
              </Box>

              {exchangeRequests.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  Немає активних запитів на обмін
                </Typography>
              ) : (
                <List>
                  {exchangeRequests.map((request) => (
                    <ListItem key={request.id} divider>
                      <ListItemText
                        primary={`${request.bookName} - ${request.bookAuthor}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Від: {request.requesterName} ({request.requesterEmail})
                            </Typography>
                            <Chip
                              label={getStatusText(request.status)}
                              color={getStatusColor(request.status) as any}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => {
                            setSelectedRequest(request)
                            setRequestDialogOpen(true)
                          }}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Exchange Request Details Dialog */}
      <Dialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Деталі запиту на обмін
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRequest.bookName} - {selectedRequest.bookAuthor}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Від: {selectedRequest.requesterName} ({selectedRequest.requesterEmail})
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Дата: {new Date(selectedRequest.createdAt).toLocaleDateString()}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Книги для обміну:
              </Typography>
              <List>
                {selectedRequest.requesterBooks.map((book) => (
                  <ListItem key={book.id}>
                    <ListItemText
                      primary={book.name}
                      secondary={book.author}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialogOpen(false)}>
            Закрити
          </Button>
          {selectedRequest?.status === 'pending' && (
            <>
              <Button
                onClick={() => {
                  handleRejectRequest(selectedRequest.id)
                  setRequestDialogOpen(false)
                }}
                color="error"
                startIcon={<CancelRequestIcon />}
              >
                Відхилити
              </Button>
              <Button
                onClick={() => {
                  handleAcceptRequest(selectedRequest.id)
                  setRequestDialogOpen(false)
                }}
                color="success"
                startIcon={<CheckCircleIcon />}
              >
                Прийняти
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
