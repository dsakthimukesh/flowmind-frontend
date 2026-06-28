import { apiClient } from "@/lib/axios/apiClient"
import { type ApiResponse } from "@/types/api"
import {
  type KnowledgeBase,
  type DocumentItem,
  type DocumentDetail,
} from "../types/knowledgeBase.types"
import { type CreateKnowledgeBaseInput } from "../schemas/createKnowledgeBase.schema"

export const getKnowledgeBases = async (): Promise<ApiResponse<KnowledgeBase[]>> => {
  const response = await apiClient.get<ApiResponse<any>>("/v1/knowledge-bases")
  return {
    ...response.data,
    data: response.data.data.knowledgeBases,
  }
}

export const createKnowledgeBase = async (
  data: CreateKnowledgeBaseInput
): Promise<ApiResponse<KnowledgeBase>> => {
  const response = await apiClient.post<ApiResponse<any>>("/v1/knowledge-bases", data)
  return {
    ...response.data,
    data: response.data.data.knowledgeBase,
  }
}

export const getKnowledgeBase = async (id: string): Promise<ApiResponse<KnowledgeBase>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/v1/knowledge-bases/${id}`)
  return {
    ...response.data,
    data: response.data.data.knowledgeBase,
  }
}

export const getDocuments = async (kbId: string): Promise<ApiResponse<DocumentItem[]>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/knowledge-bases/${kbId}/documents`
  )
  const mappedDocs = (response.data?.data?.documents || []).map((d: any) => ({
    id: d.id,
    name: d.fileName || "",
    status: d.status,
    uploadedAt: d.createdAt || "",
    sizeBytes: d.fileSize || 0,
  }))
  return {
    ...response.data,
    data: mappedDocs,
  }
}

export const getDocument = async (
  kbId: string,
  docId: string
): Promise<ApiResponse<DocumentDetail>> => {
  const response = await apiClient.get<ApiResponse<any>>(
    `/v1/knowledge-bases/${kbId}/documents/${docId}`
  )
  const d = response.data?.data?.document
  const mappedDoc = d ? {
    id: d.id,
    name: d.fileName || "",
    status: d.status,
    chunkCount: d.chunkCount || 0,
    embeddingStatus: d.status === "READY" ? "COMPLETED" : d.status,
    metadata: d.metadata || {},
    uploadedAt: d.createdAt || "",
    sizeBytes: d.fileSize || 0,
    errorMessage: d.errorMessage || null,
    storageKey: d.storageKey || "",
  } : null
  return {
    ...response.data,
    data: mappedDoc as any,
  }
}

export const uploadDocument = async (
  kbId: string,
  file: File,
  onUploadProgress?: (progressEvent: any) => void
): Promise<ApiResponse<DocumentItem>> => {
  // Convert file to base64 to match backend expectation
  const base64Content = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1]
      resolve(base64String)
    }
    reader.onerror = (err) => reject(err)
  })

  const response = await apiClient.post<ApiResponse<any>>(
    `/v1/knowledge-bases/${kbId}/documents`,
    {
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      content: base64Content,
    },
    {
      onUploadProgress,
    }
  )
  return {
    ...response.data,
    data: response.data.data.document,
  }
}

export const deleteDocument = async (
  kbId: string,
  docId: string
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/v1/knowledge-bases/${kbId}/documents/${docId}`
  )
  return response.data
}
