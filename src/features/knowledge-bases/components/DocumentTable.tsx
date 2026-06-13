import React from "react"
import { Eye, FileText } from "lucide-react"
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
import { type DocumentItem } from "../types/knowledgeBase.types"
import { DocumentStatusBadge } from "./DocumentStatusBadge"
import { EmptyState } from "@/components/common/EmptyState"

interface DocumentTableProps {
  documents: DocumentItem[]
  onViewDetails: (docId: string) => void
}

export const DocumentTable = React.memo(({ documents, onViewDetails }: DocumentTableProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === undefined || bytes === null || bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const tableHeaders = React.useMemo(
    () => (
      <TableRow className="hover:bg-transparent">
        <TableHead>File Name</TableHead>
        <TableHead className="w-[120px]">File Size</TableHead>
        <TableHead className="w-[150px]">Status</TableHead>
        <TableHead className="w-[180px]">Uploaded At</TableHead>
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    ),
    []
  )

  return (
    <Card className="shadow-sm border-border bg-card">
      <CardContent className="p-0">
        {documents.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No documents uploaded"
              description="Upload your first document (PDF, TXT, DOCX, MD) to train this knowledge base."
              icon={<FileText className="h-10 w-10 text-muted-foreground/50" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>{tableHeaders}</TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/30 transition-colors group">
                    <TableCell className="py-3.5 font-semibold text-foreground flex items-center gap-2 truncate max-w-[300px]">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{doc.name}</span>
                    </TableCell>
                    <TableCell className="py-3.5 text-muted-foreground text-xs font-semibold">
                      {formatFileSize(doc.sizeBytes)}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <DocumentStatusBadge status={doc.status} />
                    </TableCell>
                    <TableCell className="py-3.5 text-muted-foreground text-xs font-semibold">
                      {formatDate(doc.uploadedAt)}
                    </TableCell>
                    <TableCell className="py-3.5 text-right">
                      <Button
                        id={`doc-view-detail-${doc.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(doc.id)}
                        className="h-8 gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </Button>
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
})

DocumentTable.displayName = "DocumentTable"
