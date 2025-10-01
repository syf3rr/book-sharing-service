import { Alert, Button, Stack, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { capitalizeFirstLetter } from '../utils/format'
import { Link as RouterLink } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Dashboard</Typography>
      {!user && <Alert severity="info">You are not logged in.</Alert>}
      {user && (
        <>
          <Typography>Welcome, {capitalizeFirstLetter(user.name)}</Typography>
          <Button variant="outlined" component={RouterLink} to="/">Home</Button>
          <Button variant="outlined" component={RouterLink} to="/me/books">Go to My Books</Button>
        </>
      )}
    </Stack>
  )
}


