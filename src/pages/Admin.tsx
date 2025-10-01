import { useState, useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Grid,
  Divider
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon, Person as PersonIcon, Book as BookIcon } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { 
  apiGetAllUsers, 
  apiGetAllBooks, 
  apiDeleteUser, 
  apiDeleteAnyBook, 
  apiUpdateUserRole 
} from '../api/client'
import type { User, Book } from '../types'

export default function Admin() {
  const { user, token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  
  // User management state
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user')
  
  // Book management state
  const [deleteBookDialogOpen, setDeleteBookDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.')
      setLoading(false)
      return
    }
    
    fetchData()
  }, [user])

  const fetchData = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      setError(null)
      
      const [usersResponse, booksResponse] = await Promise.all([
        apiGetAllUsers(token),
        apiGetAllBooks(token)
      ])
      
      setUsers(usersResponse.users)
      setBooks(booksResponse.books)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!token || !userToDelete) return
    
    try {
      await apiDeleteUser(token, userToDelete.id)
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
      setSnackbarMessage('User deleted successfully')
      setSnackbarOpen(true)
      setDeleteUserDialogOpen(false)
      setUserToDelete(null)
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to delete user')
      setSnackbarOpen(true)
    }
  }

  const handleDeleteBook = async () => {
    if (!token || !bookToDelete) return
    
    try {
      await apiDeleteAnyBook(token, bookToDelete.id)
      setBooks(prev => prev.filter(b => b.id !== bookToDelete.id))
      setSnackbarMessage('Book deleted successfully')
      setSnackbarOpen(true)
      setDeleteBookDialogOpen(false)
      setBookToDelete(null)
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to delete book')
      setSnackbarOpen(true)
    }
  }

  const handleUpdateRole = async () => {
    if (!token || !userToUpdate) return
    
    try {
      const response = await apiUpdateUserRole(token, userToUpdate.id, newRole)
      setUsers(prev => prev.map(u => u.id === userToUpdate.id ? response.user : u))
      setSnackbarMessage('User role updated successfully')
      setSnackbarOpen(true)
      setRoleDialogOpen(false)
      setUserToUpdate(null)
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to update user role')
      setSnackbarOpen(true)
    }
  }

  const openDeleteUserDialog = (userItem: User) => {
    setUserToDelete(userItem)
    setDeleteUserDialogOpen(true)
  }

  const openRoleDialog = (userItem: User) => {
    setUserToUpdate(userItem)
    setNewRole(userItem.role as 'admin' | 'user')
    setRoleDialogOpen(true)
  }

  const openDeleteBookDialog = (book: Book) => {
    setBookToDelete(book)
    setDeleteBookDialogOpen(true)
  }

  if (user?.role !== 'admin') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        User Control Panel
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {users.length}
              </Typography>
              <Typography color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BookIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {books.length}
              </Typography>
              <Typography color="text.secondary">
                Total Books
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {users.filter(u => u.role === 'admin').length}
              </Typography>
              <Typography color="text.secondary">
                Admins
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {users.filter(u => u.role === 'user').length}
              </Typography>
              <Typography color="text.secondary">
                Regular Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Management */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Users Management
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow key={userItem.id}>
                    <TableCell>{userItem.name}</TableCell>
                    <TableCell>{userItem.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={userItem.role} 
                        color={userItem.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => openRoleDialog(userItem)}
                        disabled={userItem.id === user?.id}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => openDeleteUserDialog(userItem)}
                        disabled={userItem.id === user?.id}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Books Management */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            All Books Management
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card variant="outlined">
                  {book.photoUrl && (
                    <Box
                      component="img"
                      sx={{
                        height: 200,
                        width: '100%',
                        objectFit: 'cover'
                      }}
                      src={book.photoUrl}
                      alt={book.name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {book.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      by {book.author}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" display="block">
                      Owner: {(book as any).ownerName || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {(book as any).ownerEmail || 'Unknown'}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => openDeleteBookDialog(book)}
                        fullWidth
                      >
                        Delete Book
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Delete User Dialog */}
      <Dialog open={deleteUserDialogOpen} onClose={() => setDeleteUserDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{userToDelete?.name}" ({userToDelete?.email})?
            This action cannot be undone and will also delete all their books.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Role Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Update role for user "{userToUpdate?.name}" ({userToUpdate?.email}):
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Book Dialog */}
      <Dialog open={deleteBookDialogOpen} onClose={() => setDeleteBookDialogOpen(false)}>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete book "{bookToDelete?.name}" by {bookToDelete?.author}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteBookDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteBook} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  )
}