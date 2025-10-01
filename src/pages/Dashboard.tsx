import { Alert, Button, Stack, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { capitalizeFirstLetter } from '../utils/helpers'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '../constants'

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Dashboard</Typography>
      {!user && <Alert severity="info">You are not logged in.</Alert>}
      {user && (
        <>
          <Typography>Welcome, {capitalizeFirstLetter(user.name)}</Typography>
          <Button variant="outlined" component={RouterLink} to={ROUTES.HOME}>Home</Button>
          <Button variant="contained" component={RouterLink} to={ROUTES.BOOKS}>Browse All Books</Button>
          <Button variant="outlined" component={RouterLink} to={ROUTES.MY_BOOKS}>Go to My Books</Button>
        </>
      )}
    </Stack>
  )
}


