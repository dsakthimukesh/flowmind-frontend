import React from "react"
import { Link } from "react-router"
import { Database, FileText, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type KnowledgeBase } from "../types/knowledgeBase.types"

interface KnowledgeBaseCardProps {
  kb: KnowledgeBase
}

export const KnowledgeBaseCard = React.memo(({ kb }: KnowledgeBaseCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 border-border bg-card group relative flex flex-col justify-between h-full">
      <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-105 transition-transform">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">
              {kb.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {kb.description || <span className="italic text-muted-foreground/50">No description provided</span>}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="font-semibold text-foreground">{kb.documentCount}</span> documents
          </div>
          <span>Created {formatDate(kb.createdAt)}</span>
        </div>
      </CardContent>
      <div className="p-6 pt-0 shrink-0">
        <Button variant="outline" size="sm" className="w-full gap-1.5" asChild>
          <Link to={`/knowledge-bases/${kb.id}`}>
            View Documents <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  )
})

KnowledgeBaseCard.displayName = "KnowledgeBaseCard"
