import { Alert, Button, Stack, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { capitalizeFirstLetter } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Dashboard</Typography>
      {!user && <Alert severity="info">You are not logged in.</Alert>}
      {user && (
        <>
          <Typography>Welcome, {capitalizeFirstLetter(user.name)}</Typography>
          <Button variant="outlined" href="/">Home</Button>
        </>
      )}
    </Stack>
  )
}


