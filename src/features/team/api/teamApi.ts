import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import {
  type OrganizationMember,
  type InviteMemberRequest,
  type UpdateRoleRequest,
  type OrganizationDetail,
} from "../types/team.types"

export const getOrganization = async (): Promise<ApiResponse<OrganizationDetail>> => {
  const response = await apiClient.get<ApiResponse<OrganizationDetail>>("/v1/organizations/me")
  return response.data
}

export const getMembers = async (): Promise<ApiResponse<OrganizationMember[]>> => {
  const response = await apiClient.get<ApiResponse<OrganizationMember[]>>("/v1/organizations/me/members")
  return response.data
}

export const inviteMember = async (data: InviteMemberRequest): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post<ApiResponse<unknown>>("/v1/invitations", data)
  return response.data
}

export const updateMemberRole = async (
  userId: string,
  data: UpdateRoleRequest,
): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    `/v1/organizations/me/members/${userId}/role`,
    data,
  )
  return response.data
}

export const removeMember = async (userId: string): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.delete<ApiResponse<unknown>>(`/v1/organizations/me/members/${userId}`)
  return response.data
}
