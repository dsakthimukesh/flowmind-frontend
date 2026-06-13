import { useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router"
import { useQuery } from "@tanstack/react-query"

import { useAuthStore } from "@/stores/authStore"
import { useOrganizationStore } from "@/stores/organizationStore"
import { fetchCurrentUser } from "@/features/auth/api/authApi"
import { LoadingScreen } from "@/components/common/LoadingScreen"

export const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  
  const setOrganizations = useOrganizationStore((state) => state.setOrganizations)
  const setCurrentOrganization = useOrganizationStore((state) => state.setCurrentOrganization)
  const location = useLocation()

  // Execute query only when token is present but user profile is not loaded
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth-me"],
    queryFn: fetchCurrentUser,
    enabled: !!token && !user,
    retry: 1,
  })

  // Synchronize query results with Zustand stores
  useEffect(() => {
    if (data?.data) {
      const { user: profile, role, organizationId, organizations } = data.data
      setOrganizations(organizations)
      
      const activeOrg = organizations.find((o) => o.id === organizationId) || organizations[0] || null
      setCurrentOrganization(activeOrg)
      
      setSession(token!, profile, role, activeOrg?.id || null)
    }
  }, [data, token, setSession, setOrganizations, setCurrentOrganization])

  // Clear session if profile query fails (e.g., token expired)
  useEffect(() => {
    if (error) {
      clearSession()
    }
  }, [error, clearSession])

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (isLoading && !user) {
    return <LoadingScreen />
  }

  return <Outlet />
}
