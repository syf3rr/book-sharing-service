import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  
  // Debug logging
  console.log('Layout - User:', user)
  console.log('Layout - User role:', user?.role)
  console.log('Layout - Is admin?', user?.role === 'admin')
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Book Sharing
          </Typography>
          <Button color="inherit" component={RouterLink} to={ROUTES.BOOKS}>All Books</Button>
          {user ? (
            <>
              <Button color="inherit" component={RouterLink} to={ROUTES.MY_BOOKS}>My Books</Button>
              <Button color="inherit" component={RouterLink} to={ROUTES.EXCHANGE}>Trade</Button>
              {user.role === 'admin' && (
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to={ROUTES.ADMIN}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  User Control Panel
                </Button>
              )}
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to={ROUTES.LOGIN}>Login</Button>
              <Button color="inherit" component={RouterLink} to={ROUTES.REGISTER}>Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>{children}</Container>
    </Box>
  )
}


