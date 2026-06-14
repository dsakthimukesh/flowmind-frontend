import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import { type ApiKeyItem, type ApiKeyCreatedResponse } from "../types/apiKey.types"
import { type CreateApiKeyInput } from "../schemas/createApiKey.schema"

export const getApiKeys = async (): Promise<ApiResponse<ApiKeyItem[]>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/api-keys")
  return {
    ...response.data,
    data: response.data.data.apiKeys,
  }
}

export const createApiKey = async (
  data: CreateApiKeyInput
): Promise<ApiResponse<ApiKeyCreatedResponse>> => {
  const response = await apiClient.post<ApiResponse<ApiKeyCreatedResponse>>("/v1/api-keys", data)
  return response.data
}

export const revokeApiKey = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/v1/api-keys/${id}`)
  return response.data
}
