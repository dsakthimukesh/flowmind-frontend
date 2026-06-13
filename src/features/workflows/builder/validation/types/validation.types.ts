export interface ValidationError {
  id: string // node or edge id, or global identifier
  type: "node" | "edge" | "global"
  nodeId?: string
  message: string
  rule: string
}

export interface ValidationWarning {
  id: string
  type: "node" | "edge" | "global"
  nodeId?: string
  message: string
  rule: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}
