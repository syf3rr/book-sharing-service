import React from 'react'
import { Alert, Box, Button, CircularProgress, Typography, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Snackbar, Grid, Divider } from '@mui/material'
import { Person as PersonIcon, Book as BookIcon } from '@mui/icons-material'
import { useAdminPanel } from '../hooks/useAdminPanel'
import UsersTable from '../components/admin/UsersTable'
import BooksGrid from '../components/admin/BooksGrid'

export default function Admin() {
  const {
    user,
    users,
    books,
    loading,
    error,
    deleteUserDialogOpen,
    userToDelete,
    roleDialogOpen,
    userToUpdate,
    newRole,
    deleteBookDialogOpen,
    bookToDelete,
    setSnackbarOpen,
    setNewRole,
    setDeleteUserDialogOpen,
    setRoleDialogOpen,
    setDeleteBookDialogOpen,
    openDeleteUserDialog,
    openRoleDialog,
    openDeleteBookDialog,
    handleDeleteUser,
    handleDeleteBook,
    handleUpdateRole,
    snackbarOpen,
    snackbarMessage,
  } = useAdminPanel()

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
          <UsersTable
            users={users}
            currentUserId={user?.id}
            onEditRole={openRoleDialog}
            onDelete={openDeleteUserDialog}
          />
        </CardContent>
      </Card>

      {/* Books Management */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            All Books Management
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <BooksGrid books={books} onDelete={openDeleteBookDialog} />
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