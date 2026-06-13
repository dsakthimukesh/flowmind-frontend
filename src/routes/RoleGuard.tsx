import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/stores/authStore"
import { type Role } from "@/types/auth"

interface RoleGuardProps {
  allowedRoles: Role[]
  fallbackPath?: string
}

export const RoleGuard = ({ allowedRoles, fallbackPath = "/dashboard" }: RoleGuardProps) => {
  const role = useAuthStore((state) => state.role)

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={fallbackPath} replace />
  }

  return <Outlet />
}
