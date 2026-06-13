import React from "react"
import { Link } from "react-router"
import { Eye, Rocket, CheckCircle2, AlertCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type WorkflowVersion } from "../types/workflow.types"
import { type Role } from "@/types/auth"
import { EmptyState } from "@/components/common/EmptyState"

interface VersionHistoryTableProps {
  versions: WorkflowVersion[]
  workflowId: string
  currentRole: Role | null
  onPublishClick: (version: WorkflowVersion) => void
}

export const VersionHistoryTable = React.memo(
  ({ versions, workflowId, currentRole, onPublishClick }: VersionHistoryTableProps) => {
    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    const canPublish = currentRole === "OWNER" || currentRole === "ADMIN"

    // Memoized headers to optimize renders
    const tableHeaders = React.useMemo(
      () => (
        <TableRow>
          <TableHead>Version</TableHead>
          <TableHead>Published</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="w-[180px] text-right">Actions</TableHead>
        </TableRow>
      ),
      []
    )

    return (
      <Card>
        <CardContent className="p-0">
          {versions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No versions found"
                description="Create a version to lock and publish your changes."
                icon={<AlertCircle className="h-10 w-10 text-muted-foreground" />}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>{tableHeaders}</TableHeader>
                <TableBody>
                  {versions.map((version) => (
                    <TableRow key={version.id} className="hover:bg-muted/30">
                      <TableCell className="py-4 font-semibold text-foreground">
                        v{version.versionNumber}
                      </TableCell>
                      <TableCell className="py-4">
                        {version.isPublished ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="h-3 w-3" /> Active Release
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs font-medium">
                            Draft Release
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-muted-foreground text-sm">
                        {formatDate(version.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 text-right flex items-center justify-end gap-2">
                        {/* View Version Details */}
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            id={`version-view-detail-v${version.versionNumber}`}
                            to={`/workflows/${workflowId}/versions/${version.id}`}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" /> Details
                          </Link>
                        </Button>

                        {/* Publish Version Action */}
                        {canPublish && !version.isPublished && (
                          <Button
                            id={`version-publish-trigger-v${version.versionNumber}`}
                            variant="outline"
                            size="sm"
                            onClick={() => onPublishClick(version)}
                          >
                            <Rocket className="mr-1.5 h-3.5 w-3.5 text-primary" /> Publish
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

VersionHistoryTable.displayName = "VersionHistoryTable"
