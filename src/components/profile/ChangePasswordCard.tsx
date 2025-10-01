import { Card, CardContent, Typography, TextField, Box, Button, CircularProgress } from '@mui/material'

interface Props {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  onChange: (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => void
  onSubmit: () => void
  loading: boolean
}

export default function ChangePasswordCard({ currentPassword, newPassword, confirmPassword, onChange, onSubmit, loading }: Props) {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Змінити пароль</Typography>
        <TextField fullWidth label="Поточний пароль" type="password" value={currentPassword} onChange={(e) => onChange('currentPassword', e.target.value)} margin="normal" autoComplete="current-password" />
        <TextField fullWidth label="Новий пароль" type="password" value={newPassword} onChange={(e) => onChange('newPassword', e.target.value)} margin="normal" autoComplete="new-password" />
        <TextField fullWidth label="Підтвердження нового паролю" type="password" value={confirmPassword} onChange={(e) => onChange('confirmPassword', e.target.value)} margin="normal" autoComplete="new-password" />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={onSubmit} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Оновити пароль'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
