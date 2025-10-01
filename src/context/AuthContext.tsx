import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiLogin, apiMe, apiRegister } from '../api/client'
import type { AuthResponse, User } from '../types'
import { STORAGE_KEYS } from '../constants'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, isAdmin?: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN))
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function init() {
      const existing = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      if (!existing) {
        setLoading(false)
        return
      }
      try {
        const me = await apiMe(existing)
        setUser(me.user)
        setToken(existing)
      } catch (error) {
        console.error('Auth initialization failed:', error)
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const applyAuth = useCallback((resp: AuthResponse) => {
    console.log('AuthContext - Applying auth:', resp)
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, resp.token)
    setToken(resp.token)
    setUser(resp.user)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const resp = await apiLogin(email, password)
    applyAuth(resp)
  }, [applyAuth])

  const register = useCallback(async (name: string, email: string, password: string, isAdmin?: boolean) => {
    const resp = await apiRegister(name, email, password, isAdmin)
    applyAuth(resp)
  }, [applyAuth])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    setUser(null)
    setToken(null)
  }, [])

  const value = useMemo<AuthContextType>(() => ({ user, token, loading, login, register, logout }), [user, token, loading, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


