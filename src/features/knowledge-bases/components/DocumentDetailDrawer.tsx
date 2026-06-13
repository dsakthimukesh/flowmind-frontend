import React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { FileText, Database, Layers, Info } from "lucide-react"
import { useDocument } from "../hooks/useDocument"
import { DocumentStatusBadge } from "./DocumentStatusBadge"
import { Skeleton } from "@/components/ui/skeleton"

interface DocumentDetailDrawerProps {
  kbId: string
  docId: string | null
  open: boolean
  onClose: () => void
}

export const DocumentDetailDrawer = React.memo(
  ({ kbId, docId, open, onClose }: DocumentDetailDrawerProps) => {
    const { data: documentResponse, isLoading, error } = useDocument(kbId, docId || "")
    const doc = documentResponse?.data

    const formatFileSize = (bytes?: number) => {
      if (bytes === undefined || bytes === null || bytes === 0) return "0 Bytes"
      const k = 1024
      const sizes = ["Bytes", "KB", "MB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    }

    return (
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent className="sm:max-w-[450px] overflow-y-auto">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2 text-foreground font-bold">
              <FileText className="h-5 w-5 text-primary" />
              Document Details
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground font-medium truncate">
              {doc?.name || "Loading file details..."}
            </SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-[120px] w-full" />
              </div>
            </div>
          ) : error ? (
            <div className="py-8 text-center space-y-2 select-none">
              <p className="text-sm font-semibold text-destructive">Failed to load details</p>
              <p className="text-xs text-muted-foreground">Please try closing and reopening the drawer.</p>
            </div>
          ) : (
            doc && (
              <div className="space-y-6 py-6 animate-in fade-in duration-300">
                {/* Status Badges */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-muted-foreground">Processing Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <DocumentStatusBadge status={doc.status} />
                  </div>
                </div>

                {/* Details Statistics Card grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-xl bg-muted/20">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
                      <Layers className="h-3.5 w-3.5" />
                      Chunks
                    </div>
                    <div className="text-xl font-bold text-foreground">{doc.chunkCount}</div>
                  </div>

                  <div className="p-4 border border-border rounded-xl bg-muted/20">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
                      <Database className="h-3.5 w-3.5" />
                      Embedding Status
                    </div>
                    <div className="text-sm font-bold text-foreground uppercase truncate">
                      {doc.embeddingStatus || "PENDING"}
                    </div>
                  </div>
                </div>

                {/* File size & upload timestamp summary */}
                <div className="space-y-3.5 border border-border rounded-xl p-4 bg-card">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">File Size</span>
                    <span className="text-foreground font-bold">{formatFileSize(doc.sizeBytes)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold border-t border-border/50 pt-3">
                    <span className="text-muted-foreground">Uploaded On</span>
                    <span className="text-foreground/80 font-mono">
                      {new Date(doc.uploadedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Metadata JSON card */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    Metadata Attributes
                  </div>
                  {doc.metadata && Object.keys(doc.metadata).length > 0 ? (
                    <pre className="bg-muted p-4 rounded-xl text-xs font-mono text-foreground overflow-x-auto border border-border leading-relaxed select-text">
                      {JSON.stringify(doc.metadata, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-4 border border-dashed border-border rounded-xl text-center text-xs italic text-muted-foreground/60">
                      No metadata attributes available.
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </SheetContent>
      </Sheet>
    )
  }
)

DocumentDetailDrawer.displayName = "DocumentDetailDrawer"
