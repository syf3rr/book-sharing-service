import { useEffect, useState } from 'react'
import { createProfileService } from '../services/profileService'
import { useAuthStore } from '../store/useAuthStore'
import type { UpdateProfileParams, ExchangeRequestData, ChangePasswordParams } from '../types'

export function useProfilePage() {
  const user = useAuthStore(s => s.user)
  const updateUser = useAuthStore(s => s.updateUser)
  const profileService = createProfileService()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' })
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
      setFormData({ name: user.name, email: user.email })
      setAvatarPreview(user.avatar || null)
    }
  }, [user])

  useEffect(() => {
    fetchExchangeRequests()
  }, [])

  const fetchExchangeRequests = async () => {
    try {
      const response = await profileService.getExchangeRequests()
      setExchangeRequests(response.requests as any)
    } catch (error) {
      console.error('Error fetching exchange requests:', error)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setFormData({ name: user?.name || '', email: user?.email || '' })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({ name: user?.name || '', email: user?.email || '' })
    setAvatar(null)
    setAvatarPreview(user?.avatar || null)
  }

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    setMessage(null)
    try {
      let avatarUrl = user.avatar
      if (avatar) {
        avatarUrl = await profileService.uploadAvatar(avatar)
      }
      const updateData: UpdateProfileParams = { name: formData.name, email: formData.email, avatar: avatarUrl }
      const response = await profileService.updateProfile(updateData)
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
      await profileService.changePassword(payload)
      setMessage({ type: 'success', text: 'Пароль успішно змінено' })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Не вдалося змінити пароль' })
    } finally {
      setPasswordLoading(false)
    }
  }

  return {
    user,
    isEditing,
    formData,
    avatarPreview,
    exchangeRequests,
    loading,
    message,
    selectedRequest,
    requestDialogOpen,
    passwordForm,
    passwordLoading,
    setRequestDialogOpen,
    setSelectedRequest,
    handleEdit,
    handleCancel,
    handleInputChange,
    handleAvatarChange,
    handleSave,
    handlePasswordChangeInput,
    handleChangePassword,
    fetchExchangeRequests,
    getStatusColor: (status: string) => {
      switch (status) {
        case 'pending': return 'warning'
        case 'accepted': return 'success'
        case 'rejected': return 'error'
        case 'completed': return 'info'
        default: return 'default'
      }
    },
    getStatusText: (status: string) => {
      switch (status) {
        case 'pending': return 'Очікує'
        case 'accepted': return 'Прийнято'
        case 'rejected': return 'Відхилено'
        case 'completed': return 'Завершено'
        default: return status
      }
    },
    setMessage,
  }
}

export type UseProfilePageReturn = ReturnType<typeof useProfilePage>


