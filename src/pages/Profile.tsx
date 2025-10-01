import React from 'react'
import { Box, Grid, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { useProfilePage } from '../hooks/useProfilePage'
import ProfileInfoCard from '../components/profile/ProfileInfoCard'
import ChangePasswordCard from '../components/profile/ChangePasswordCard'
import ExchangeRequestsList from '../components/profile/ExchangeRequestsList'

export default function Profile() {
  const {
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
    getStatusColor,
    getStatusText,
    setMessage,
  } = useProfilePage()

  if (!user) return <CircularProgress />

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ProfileInfoCard
            userName={user.name}
            userEmail={user.email}
            booksCount={user.booksCount || 0}
            avatarPreview={avatarPreview}
            isEditing={isEditing}
            formName={formData.name}
            formEmail={formData.email}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onChangeName={(v) => handleInputChange('name')({ target: { value: v } } as any)}
            onChangeEmail={(v) => handleInputChange('email')({ target: { value: v } } as any)}
            onAvatarChange={(file) => {
              const evt = { target: { files: file ? [file] : [] } } as any
              handleAvatarChange(evt)
            }}
            onSave={handleSave}
            saving={loading}
          />

          <ChangePasswordCard
            currentPassword={passwordForm.currentPassword}
            newPassword={passwordForm.newPassword}
            confirmPassword={passwordForm.confirmPassword}
            onChange={(field, value) => handlePasswordChangeInput(field)({ target: { value } } as any)}
            onSubmit={handleChangePassword}
            loading={passwordLoading}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ExchangeRequestsList
            requests={exchangeRequests}
            onOpenDetails={(req) => {
              setSelectedRequest(req)
              setRequestDialogOpen(true)
            }}
            getStatusColor={getStatusColor as any}
            getStatusText={getStatusText}
          />
        </Grid>
      </Grid>

      <Dialog open={requestDialogOpen} onClose={() => setRequestDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Деталі запиту на обмін</DialogTitle>
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
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialogOpen(false)}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
