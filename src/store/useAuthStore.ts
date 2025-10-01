import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../constants'
import type { AuthResponse, User } from '../types'
import { apiLogin, apiMe, apiRegister } from '../api/client'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  init: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, isAdmin?: boolean) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
  applyAuth: (resp: AuthResponse) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,

      applyAuth: (resp: AuthResponse) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, resp.token)
        set({ token: resp.token, user: resp.user })
      },

      init: async () => {
        const existing = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        if (!existing) {
          set({ loading: false })
          return
        }
        try {
          const me = await apiMe(existing)
          set({ user: me.user, token: existing })
        } catch {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
          set({ user: null, token: null })
        } finally {
          set({ loading: true })
          set({ loading: false })
        }
      },

      login: async (email: string, password: string) => {
        const resp = await apiLogin(email, password)
        get().applyAuth(resp)
      },

      register: async (name: string, email: string, password: string, isAdmin?: boolean) => {
        const resp = await apiRegister(name, email, password, isAdmin)
        get().applyAuth(resp)
      },

      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        set({ user: null, token: null })
      },

      updateUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ token: state.token, user: state.user }),
      version: 1,
    }
  )
)

export default useAuthStore


