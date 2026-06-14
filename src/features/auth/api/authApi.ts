import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import { type User, type Role, type AuthSession } from "@/types/auth"
import { type Organization } from "@/types/organization"

export interface MeResponse {
  user: User
  role: Role
  organizationId: string | null
  organizations: Organization[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  organizationName: string
}

export const loginUser = async (credentials: LoginRequest): Promise<ApiResponse<AuthSession>> => {
  const response = await apiClient.post<ApiResponse<any>>("/v1/auth/login", credentials)
  return {
    ...response.data,
    data: {
      token: response.data.data.accessToken,
      user: response.data.data.user,
      role: response.data.data.role,
      organizationId: response.data.data.organizationId,
    },
  }
}

export const registerUser = async (details: RegisterRequest): Promise<ApiResponse<{ user: User }>> => {
  const response = await apiClient.post<ApiResponse<{ user: User }>>("/v1/auth/register", details)
  return response.data
}

export const fetchCurrentUser = async (): Promise<ApiResponse<MeResponse>> => {
  const response = await apiClient.get<ApiResponse<MeResponse>>("/v1/auth/me")
  return response.data
}
