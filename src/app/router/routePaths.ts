export const ROUTE_PATHS = {
  // Public
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  INVITE: "/invite",

  // Protected
  DASHBOARD: "/dashboard",
  WORKFLOWS: "/workflows",
  WORKFLOW_DETAIL: "/workflows/:workflowId",
  WORKFLOW_VERSION: "/workflows/:workflowId/versions/:versionId",
  WORKFLOW_BUILDER: "/workflows/:workflowId/builder",
  WORKFLOW_SCHEDULES: "/workflows/:workflowId/schedules",
  EXECUTIONS: "/executions",
  EXECUTION_DETAIL: "/executions/:executionId",
  KNOWLEDGE_BASES: "/knowledge-bases",
  KNOWLEDGE_BASE_DETAIL: "/knowledge-bases/:knowledgeBaseId",
  TEAM: "/team",
  API_KEYS: "/api-keys",
  AUDIT_LOGS: "/audit-logs",
  SETTINGS: "/settings",
  HELP: "/help",
} as const
