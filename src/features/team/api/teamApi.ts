import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import {
  type OrganizationMember,
  type InviteMemberRequest,
  type UpdateRoleRequest,
  type OrganizationDetail,
} from "../types/team.types"

export const getOrganization = async (): Promise<ApiResponse<OrganizationDetail>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/organizations/me")
  return {
    ...response.data,
    data: response.data.data.organization,
  }
}

export const getMembers = async (): Promise<ApiResponse<OrganizationMember[]>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/organizations/me/members")
  const members = (response.data?.data?.members || []).map((m: any) => ({
    id: m.userId,
    email: m.user?.email || "",
    firstName: m.user?.firstName || "",
    lastName: m.user?.lastName || "",
    role: m.role,
    status: m.user?.status?.toLowerCase() === "active" ? "active" : "pending",
    joinedAt: m.joinedAt,
  }))
  return {
    ...response.data,
    data: members,
  }
}

export const inviteMember = async (data: InviteMemberRequest): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post<ApiResponse<any>>("/v1/invitations", data)
  return response.data
}

export const updateMemberRole = async (
  userId: string,
  data: UpdateRoleRequest,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.patch<ApiResponse<any>>(
    `/v1/organizations/me/members/${userId}/role`,
    data,
  )
  return {
    ...response.data,
    data: response.data.data.member,
  }
}

export const removeMember = async (userId: string): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.delete<ApiResponse<any>>(`/v1/organizations/me/members/${userId}`)
  return response.data
}
