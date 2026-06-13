export const queryKeys = {
  dashboard: {
    metrics: ["dashboard", "metrics"] as const,
    executions: ["dashboard", "executions"] as const,
    workflows: ["dashboard", "workflows"] as const,
    organization: ["dashboard", "organization"] as const,
  },
  team: {
    organization: ["team", "organization"] as const,
    members: ["team", "members"] as const,
  },
  workflows: {
    all: ["workflows"] as const,
    detail: (id: string) => ["workflows", id] as const,
    versions: (id: string) => ["workflow-versions", id] as const,
    version: (workflowId: string, versionId: string) =>
      ["workflow-version", workflowId, versionId] as const,
  },
  schedules: {
    all: (workflowId: string) => ["workflow-schedules", workflowId] as const,
  },
  executions: {
    all: ["executions"] as const,
    detail: (id: string) => ["execution", id] as const,
    logs: (id: string, page: number, pageSize: number) =>
      ["execution-logs", id, page, pageSize] as const,
    metrics: ["execution-metrics"] as const,
  },
  knowledgeBases: {
    all: ["knowledge-bases"] as const,
    detail: (id: string) => ["knowledge-base", id] as const,
    documents: (id: string) => ["knowledge-base-documents", id] as const,
    document: (kbId: string, docId: string) => ["document", kbId, docId] as const,
  },
  apiKeys: {
    all: ["api-keys"] as const,
  },
  auditLogs: {
    all: (filters: Record<string, any>) => ["audit-logs", filters] as const,
  },
} as const
