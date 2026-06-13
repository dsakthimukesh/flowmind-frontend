export type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  token: string
  user: User
  role: Role
  organizationId: string | null
}
