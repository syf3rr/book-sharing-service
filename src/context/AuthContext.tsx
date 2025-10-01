import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { apiLogin, apiMe, apiRegister, type AuthResponse } from '../api/client'

type User = { id: string; email: string; role: string }

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'auth_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function init() {
      const existing = localStorage.getItem(TOKEN_KEY)
      if (!existing) {
        setLoading(false)
        return
      }
      try {
        const me = await apiMe(existing)
        setUser(me.user)
        setToken(existing)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const applyAuth = useCallback((resp: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, resp.token)
    setToken(resp.token)
    setUser(resp.user)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const resp = await apiLogin(email, password)
    applyAuth(resp)
  }, [applyAuth])

  const register = useCallback(async (email: string, password: string) => {
    const resp = await apiRegister(email, password)
    applyAuth(resp)
  }, [applyAuth])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
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


