import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import {
  type KnowledgeBase,
  type DocumentItem,
  type DocumentDetail,
} from "../types/knowledgeBase.types"
import { type CreateKnowledgeBaseInput } from "../schemas/createKnowledgeBase.schema"

export const getKnowledgeBases = async (): Promise<ApiResponse<KnowledgeBase[]>> => {
  const response = await apiClient.get<ApiResponse<KnowledgeBase[]>>("/v1/knowledge-bases")
  return response.data
}

export const createKnowledgeBase = async (
  data: CreateKnowledgeBaseInput
): Promise<ApiResponse<KnowledgeBase>> => {
  const response = await apiClient.post<ApiResponse<KnowledgeBase>>("/v1/knowledge-bases", data)
  return response.data
}

export const getKnowledgeBase = async (id: string): Promise<ApiResponse<KnowledgeBase>> => {
  const response = await apiClient.get<ApiResponse<KnowledgeBase>>(`/v1/knowledge-bases/${id}`)
  return response.data
}

export const getDocuments = async (kbId: string): Promise<ApiResponse<DocumentItem[]>> => {
  const response = await apiClient.get<ApiResponse<DocumentItem[]>>(
    `/v1/knowledge-bases/${kbId}/documents`
  )
  return response.data
}

export const getDocument = async (
  kbId: string,
  docId: string
): Promise<ApiResponse<DocumentDetail>> => {
  const response = await apiClient.get<ApiResponse<DocumentDetail>>(
    `/v1/knowledge-bases/${kbId}/documents/${docId}`
  )
  return response.data
}

export const uploadDocument = async (
  kbId: string,
  file: File,
  onUploadProgress?: (progressEvent: any) => void
): Promise<ApiResponse<DocumentItem>> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await apiClient.post<ApiResponse<DocumentItem>>(
    `/v1/knowledge-bases/${kbId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }
  )
  return response.data
}
