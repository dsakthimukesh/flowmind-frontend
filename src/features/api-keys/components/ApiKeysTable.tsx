import React from "react"
import { Trash2, Key } from "lucide-react"
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
import { type ApiKeyItem } from "../types/apiKey.types"
import { EmptyState } from "@/components/common/EmptyState"

interface ApiKeysTableProps {
  apiKeys: ApiKeyItem[]
  onRevoke: (id: string, name: string) => void
  canModify: boolean
}

export const ApiKeysTable = React.memo(({ apiKeys, onRevoke, canModify }: ApiKeysTableProps) => {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Never"
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
        <TableHead>Key Name</TableHead>
        <TableHead className="w-[180px]">Key Prefix</TableHead>
        <TableHead className="w-[180px]">Created At</TableHead>
        <TableHead className="w-[180px]">Last Used</TableHead>
        {canModify && <TableHead className="w-[100px] text-right">Actions</TableHead>}
      </TableRow>
    ),
    [canModify]
  )

  return (
    <Card className="shadow-sm border-border bg-card">
      <CardContent className="p-0">
        {apiKeys.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No API keys created"
              description="Create an API key to allow external integrations to trigger your workflows."
              icon={<Key className="h-10 w-10 text-muted-foreground/50" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>{tableHeaders}</TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id} className="hover:bg-muted/30 transition-colors group">
                    <TableCell className="py-3.5 font-semibold text-foreground">
                      {key.name}
                    </TableCell>
                    <TableCell className="py-3.5 font-mono text-xs text-muted-foreground font-semibold">
                      {key.prefix}...
                    </TableCell>
                    <TableCell className="py-3.5 text-muted-foreground text-xs font-semibold">
                      {formatDate(key.createdAt)}
                    </TableCell>
                    <TableCell className="py-3.5 text-muted-foreground text-xs font-semibold">
                      {formatDate(key.lastUsedAt)}
                    </TableCell>
                    {canModify && (
                      <TableCell className="py-3.5 text-right">
                        <Button
                          id={`revoke-key-${key.id}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => onRevoke(key.id, key.name)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Revoke Key</span>
                        </Button>
                      </TableCell>
                    )}
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

ApiKeysTable.displayName = "ApiKeysTable"
