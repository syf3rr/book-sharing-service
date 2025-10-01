import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyBooks from './pages/MyBooks'
import AddBook from './pages/AddBook'
import BooksList from './pages/BooksList'
import BookDetails from './pages/BookDetails'
import Exchange from './pages/Exchange'
import TestExchange from './pages/TestExchange'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ROUTES } from './constants'
import type { ReactElement } from 'react'

function PrivateRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to={ROUTES.LOGIN} replace />
}

const theme = createTheme()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path={ROUTES.HOME} element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
              <Route path={ROUTES.MY_BOOKS} element={<PrivateRoute><MyBooks /></PrivateRoute>} />
              <Route path={ROUTES.ADD_BOOK} element={<PrivateRoute><AddBook /></PrivateRoute>} />
              <Route path={ROUTES.EXCHANGE} element={<PrivateRoute><Exchange /></PrivateRoute>} />
              <Route path={ROUTES.TEST_EXCHANGE} element={<TestExchange />} />
              <Route path={ROUTES.ADMIN} element={<PrivateRoute><Admin /></PrivateRoute>} />
              <Route path={ROUTES.PROFILE} element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path={ROUTES.BOOKS} element={<BooksList />} />
              <Route path="/books/:bookId" element={<BookDetails />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
