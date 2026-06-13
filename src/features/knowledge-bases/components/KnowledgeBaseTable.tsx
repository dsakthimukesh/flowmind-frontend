import React from "react"
import { Link } from "react-router"
import { ArrowRight, Database } from "lucide-react"
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
import { type KnowledgeBase } from "../types/knowledgeBase.types"
import { EmptyState } from "@/components/common/EmptyState"

interface KnowledgeBaseTableProps {
  knowledgeBases: KnowledgeBase[]
}

export const KnowledgeBaseTable = React.memo(({ knowledgeBases }: KnowledgeBaseTableProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const tableHeaders = React.useMemo(
    () => (
      <TableRow className="hover:bg-transparent">
        <TableHead>Name</TableHead>
        <TableHead>Description</TableHead>
        <TableHead className="w-[150px]">Documents</TableHead>
        <TableHead className="w-[180px]">Created Date</TableHead>
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    ),
    []
  )

  return (
    <Card className="shadow-sm border-border bg-card">
      <CardContent className="p-0">
        {knowledgeBases.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No knowledge bases found"
              description="Create your first knowledge base to start indexing documents."
              icon={<Database className="h-10 w-10 text-muted-foreground/50" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>{tableHeaders}</TableHeader>
              <TableBody>
                {knowledgeBases.map((kb) => (
                  <TableRow key={kb.id} className="hover:bg-muted/30 transition-colors group">
                    <TableCell className="py-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                      <Link to={`/knowledge-bases/${kb.id}`} className="hover:underline">
                        {kb.name}
                      </Link>
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground max-w-[350px] truncate">
                      {kb.description || <span className="italic text-muted-foreground/30">No description</span>}
                    </TableCell>
                    <TableCell className="py-4 text-foreground font-semibold text-sm">
                      {kb.documentCount} files
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground text-sm">
                      {formatDate(kb.createdAt)}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <Button
                        id={`kb-view-detail-${kb.id}`}
                        variant="ghost"
                        size="sm"
                        asChild
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Link to={`/knowledge-bases/${kb.id}`}>
                          View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
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

KnowledgeBaseTable.displayName = "KnowledgeBaseTable"
