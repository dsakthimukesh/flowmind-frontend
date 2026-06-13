export interface ApiKeyItem {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt?: string | null

  // Future-proofing fields
  usageCount?: number
  rateLimit?: number
  scopes?: string[]
}

export interface ApiKeyCreatedResponse {
  id: string
  name: string
  key: string
}
