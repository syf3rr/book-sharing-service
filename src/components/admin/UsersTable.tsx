import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import type { User } from '../../types'

interface Props {
  users: User[]
  currentUserId?: string
  onEditRole: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({ users, currentUserId, onEditRole, onDelete }: Props) {
  return (
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
                  onClick={() => onEditRole(userItem)}
                  disabled={userItem.id === currentUserId}
                  size="small"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => onDelete(userItem)}
                  disabled={userItem.id === currentUserId}
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
  )
}

export default UsersTable


