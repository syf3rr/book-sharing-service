import { AppBar, Box, Button, Container, Toolbar, Typography, Avatar, Menu, MenuItem, IconButton } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  
  // Debug logging
  console.log('Layout - User:', user)
  console.log('Layout - User role:', user?.role)
  console.log('Layout - Is admin?', user?.role === 'admin')

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }
  
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
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 2 }}
              >
                <Avatar 
                  src={user.avatar} 
                  sx={{ width: 32, height: 32 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={handleProfileMenuClose} component={RouterLink} to={ROUTES.PROFILE}>
                  Профіль
                </MenuItem>
                <MenuItem onClick={() => { handleProfileMenuClose(); logout(); }}>
                  Вийти
                </MenuItem>
              </Menu>
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


