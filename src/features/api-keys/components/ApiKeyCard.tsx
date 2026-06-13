import React from "react"
import { Trash2, Key, Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type ApiKeyItem } from "../types/apiKey.types"

interface ApiKeyCardProps {
  apiKey: ApiKeyItem
  onRevoke: (id: string, name: string) => void
  canModify: boolean
}

export const ApiKeyCard = React.memo(({ apiKey, onRevoke, canModify }: ApiKeyCardProps) => {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Never"
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 border-border bg-card group relative">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 truncate">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <Key className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-foreground truncate">{apiKey.name}</h4>
            </div>
            <p className="font-mono text-xs text-muted-foreground pt-1.5 select-all font-semibold">
              {apiKey.prefix}...
            </p>
          </div>
          {canModify && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
              onClick={() => onRevoke(apiKey.id, apiKey.name)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Revoke</span>
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Created:
            </span>
            <span className="text-foreground">{formatDate(apiKey.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Last Used:
            </span>
            <span className="text-foreground">{formatDate(apiKey.lastUsedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ApiKeyCard.displayName = "ApiKeyCard"
