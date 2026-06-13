import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type User, type Role } from "@/types/auth"
import { setToken, removeToken, getToken } from "@/lib/utils/storage"

interface AuthState {
  token: string | null
  user: User | null
  role: Role | null
  organizationId: string | null
  setSession: (token: string, user: User, role: Role, organizationId: string | null) => void
  clearSession: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: getToken(),
      user: null,
      role: null,
      organizationId: null,
      setSession: (token, user, role, organizationId) => {
        setToken(token)
        set({ token, user, role, organizationId })
      },
      clearSession: () => {
        removeToken()
        set({ token: null, user: null, role: null, organizationId: null })
      },
      isAuthenticated: () => {
        return !!get().token
      },
    }),
    {
      name: "flowmind_auth_session",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        role: state.role,
        organizationId: state.organizationId,
      }),
    }
  )
)
