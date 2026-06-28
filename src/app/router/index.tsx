import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router"

import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { PublicRoute } from "@/routes/PublicRoute"
import { RoleGuard } from "@/routes/RoleGuard"
import { LoadingScreen } from "@/components/common/LoadingScreen"
import { GlobalErrorBoundary } from "@/components/errors/GlobalErrorBoundary"
import { RouteErrorBoundary } from "@/components/errors/RouteErrorBoundary"
import { ROUTE_PATHS } from "./routePaths"

// Lazy load layouts with named export resolver
const AppLayout = lazy(() => import("../layouts/AppLayout").then((m) => ({ default: m.AppLayout })))
const AuthLayout = lazy(() => import("../layouts/AuthLayout").then((m) => ({ default: m.AuthLayout })))

// Lazy load pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })))
const InvitePage = lazy(() => import("@/features/auth/pages/InvitePage").then((m) => ({ default: m.InvitePage })))

const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })))
const WorkflowsPage = lazy(() => import("@/features/workflows/pages/WorkflowsPage").then((m) => ({ default: m.WorkflowsPage })))
const WorkflowDetailPage = lazy(() => import("@/features/workflows/pages/WorkflowDetailPage").then((m) => ({ default: m.WorkflowDetailPage })))
const WorkflowVersionPage = lazy(() => import("@/features/workflows/pages/WorkflowVersionPage").then((m) => ({ default: m.WorkflowVersionPage })))
const WorkflowBuilderPage = lazy(() => import("@/features/workflows/builder/pages/WorkflowBuilderPage").then((m) => ({ default: m.WorkflowBuilderPage })))
const WorkflowSchedulesPage = lazy(() => import("@/features/workflows/schedules/pages/WorkflowSchedulesPage").then((m) => ({ default: m.WorkflowSchedulesPage })))
const ExecutionsPage = lazy(() => import("@/features/executions/pages/ExecutionsPage").then((m) => ({ default: m.ExecutionsPage })))
const ExecutionDetailPage = lazy(() => import("@/features/executions/pages/ExecutionDetailPage").then((m) => ({ default: m.ExecutionDetailPage })))
const KnowledgeBasesPage = lazy(() => import("@/features/knowledge-bases/pages/KnowledgeBasesPage").then((m) => ({ default: m.KnowledgeBasesPage })))
const KnowledgeBaseDetailPage = lazy(() => import("@/features/knowledge-bases/pages/KnowledgeBaseDetailPage").then((m) => ({ default: m.KnowledgeBaseDetailPage })))
const TeamPage = lazy(() => import("@/features/team/pages/TeamPage").then((m) => ({ default: m.TeamPage })))
const ApiKeysPage = lazy(() => import("@/features/api-keys/pages/ApiKeysPage").then((m) => ({ default: m.ApiKeysPage })))
const AuditLogsPage = lazy(() => import("@/features/audit-logs/pages/AuditLogsPage").then((m) => ({ default: m.AuditLogsPage })))
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })))
const GuidesPage = lazy(() => import("@/features/guides/pages/GuidesPage").then((m) => ({ default: m.GuidesPage })))

const router = createBrowserRouter([
  // Public auth routes
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTE_PATHS.LOGIN, element: <LoginPage /> },
          { path: ROUTE_PATHS.REGISTER, element: <RegisterPage /> },
          { path: ROUTE_PATHS.INVITE, element: <InvitePage /> },
        ],
      },
    ],
  },

  // Protected application routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTE_PATHS.DASHBOARD, element: <RouteErrorBoundary><DashboardPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.WORKFLOWS, element: <RouteErrorBoundary><WorkflowsPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.WORKFLOW_DETAIL, element: <RouteErrorBoundary><WorkflowDetailPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.WORKFLOW_VERSION, element: <RouteErrorBoundary><WorkflowVersionPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.WORKFLOW_BUILDER, element: <RouteErrorBoundary><WorkflowBuilderPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.WORKFLOW_SCHEDULES, element: <RouteErrorBoundary><WorkflowSchedulesPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.EXECUTIONS, element: <RouteErrorBoundary><ExecutionsPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.EXECUTION_DETAIL, element: <RouteErrorBoundary><ExecutionDetailPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.KNOWLEDGE_BASES, element: <RouteErrorBoundary><KnowledgeBasesPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.KNOWLEDGE_BASE_DETAIL, element: <RouteErrorBoundary><KnowledgeBaseDetailPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.TEAM, element: <RouteErrorBoundary><TeamPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.API_KEYS, element: <RouteErrorBoundary><ApiKeysPage /></RouteErrorBoundary> },
          {
            element: <RoleGuard allowedRoles={["OWNER", "ADMIN"]} />,
            children: [
              { path: ROUTE_PATHS.AUDIT_LOGS, element: <RouteErrorBoundary><AuditLogsPage /></RouteErrorBoundary> },
            ],
          },
          { path: ROUTE_PATHS.SETTINGS, element: <RouteErrorBoundary><SettingsPage /></RouteErrorBoundary> },
          { path: ROUTE_PATHS.HELP, element: <RouteErrorBoundary><GuidesPage /></RouteErrorBoundary> },
        ],
      },
    ],
  },

  // Redirect root path to dashboard (which will redirect to login if unauthenticated)
  {
    path: "/",
    element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace />,
  },

  // Fallback Route
  {
    path: "*",
    element: <Navigate to={ROUTE_PATHS.DASHBOARD} replace />,
  },
])

export const AppRouter = () => {
  return (
    <GlobalErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </GlobalErrorBoundary>
  )
}
