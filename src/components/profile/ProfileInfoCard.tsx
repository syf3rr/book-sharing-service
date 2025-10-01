import { Box, Card, CardContent, Typography, TextField, Button, Avatar, Divider, CircularProgress } from '@mui/material'

interface Props {
  userName: string
  userEmail: string
  booksCount: number
  avatarPreview?: string | null
  isEditing: boolean
  formName: string
  formEmail: string
  onEdit: () => void
  onCancel: () => void
  onChangeName: (v: string) => void
  onChangeEmail: (v: string) => void
  onAvatarChange: (file: File | null) => void
  onSave: () => void
  saving: boolean
}

export default function ProfileInfoCard(props: Props) {
  const {
    userName,
    userEmail,
    booksCount,
    avatarPreview,
    isEditing,
    formName,
    formEmail,
    onEdit,
    onCancel,
    onChangeName,
    onChangeEmail,
    onAvatarChange,
    onSave,
    saving,
  } = props

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onAvatarChange(file)
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar src={avatarPreview || undefined} sx={{ width: 80, height: 80, mr: 2 }}>
            {userName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{userName}</Typography>
            <Typography color="text.secondary">{userEmail}</Typography>
            <Typography variant="body2" color="text.secondary">Книг у бібліотеці: {booksCount || 0}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {isEditing ? (
          <Box>
            <TextField fullWidth label="Ім'я" value={formName} onChange={(e) => onChangeName(e.target.value)} margin="normal" />
            <TextField fullWidth label="Email" value={formEmail} onChange={(e) => onChangeEmail(e.target.value)} margin="normal" type="email" />

            <Box sx={{ mt: 2 }}>
              <input accept="image/*" style={{ display: 'none' }} id="avatar-upload" type="file" onChange={handleInputFile} />
              <label htmlFor="avatar-upload">
                <Button variant="outlined" component="span" sx={{ mr: 2 }}>
                  Змінити аватар
                </Button>
              </label>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={onSave} disabled={saving}>
                {saving ? <CircularProgress size={20} /> : 'Зберегти'}
              </Button>
              <Button variant="outlined" onClick={onCancel}>Скасувати</Button>
            </Box>
          </Box>
        ) : (
          <Button variant="outlined" onClick={onEdit}>Редагувати профіль</Button>
        )}
      </CardContent>
    </Card>
  )
}
