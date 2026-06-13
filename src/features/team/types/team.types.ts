import { type Role } from "@/types/auth"

export interface OrganizationMember {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  status: "active" | "invited" | "pending"
  joinedAt: string
}

export interface OrganizationDetail {
  id: string
  name: string
  slug: string
  plan: string
  createdAt: string
  updatedAt: string
  members: OrganizationMember[]
  memberCount?: number
}

export interface InviteMemberRequest {
  email: string
  role: "ADMIN" | "MEMBER" | "VIEWER"
}

export interface UpdateRoleRequest {
  role: "ADMIN" | "MEMBER" | "VIEWER"
}
