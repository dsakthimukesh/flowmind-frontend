export interface KnowledgeBase {
  id: string
  name: string
  description?: string
  documentCount: number
  createdAt: string
  updatedAt: string
}

export interface KnowledgeBaseStats {
  total: number
  processed: number
  failed: number
  pending: number
}

export type DocumentStatus = "PENDING" | "PROCESSING" | "PROCESSED" | "FAILED"

export interface DocumentItem {
  id: string
  name: string
  status: DocumentStatus
  uploadedAt: string
  sizeBytes: number
}

export interface DocumentDetail {
  id: string
  name: string
  status: DocumentStatus
  chunkCount: number
  embeddingStatus: string
  metadata?: Record<string, any>
  uploadedAt: string
  sizeBytes: number
}
