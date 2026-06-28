import React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { FileText, Database, Layers, Info, AlertTriangle, Calendar, HardDrive, FolderOpen } from "lucide-react"
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

    const getFileIconColor = (name?: string) => {
      const ext = name?.split('.').pop()?.toLowerCase()
      if (ext === 'pdf') return 'bg-red-500/10 text-red-500 border-red-500/20'
      if (ext === 'docx' || ext === 'doc') return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      if (ext === 'txt') return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      return 'bg-teal-500/10 text-teal-500 border-teal-500/20'
    }

    const formatUploadedDate = (dateStr?: string) => {
      if (!dateStr) return "Invalid Date"
      try {
        return new Date(dateStr).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      } catch {
        return dateStr
      }
    }

    return (
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent className="sm:max-w-[460px] overflow-y-auto border-l border-border bg-card">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2 text-foreground font-bold text-lg">
              <FileText className="h-5 w-5 text-primary animate-pulse" />
              Document Library Detail
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground font-medium select-text break-all">
              ID: {doc?.id || "Loading..."}
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
            <div className="py-12 text-center space-y-3 select-none">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto animate-bounce" />
              <p className="text-sm font-bold text-destructive">Failed to load details</p>
              <p className="text-xs text-muted-foreground">Please try closing and reopening the drawer.</p>
            </div>
          ) : (
            doc && (
              <div className="space-y-6 py-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Visual Header Block */}
                <div className="flex items-center gap-3.5 bg-muted/30 p-4 rounded-xl border border-border">
                  <div className={`p-3 rounded-lg border text-xl font-bold shrink-0 flex items-center justify-center h-12 w-12 ${getFileIconColor(doc.name)}`}>
                    {doc.name.split('.').pop()?.toUpperCase().slice(0, 4) || "DOC"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-foreground leading-snug break-all select-all">
                      {doc.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 capitalize">
                      Format: {doc.name.split('.').pop() || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Processing Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <DocumentStatusBadge status={doc.status} />
                  </div>
                </div>

                {/* Error Banner if failed */}
                {doc.status === "FAILED" && doc.errorMessage && (
                  <div className="p-4 bg-destructive/10 text-destructive text-xs rounded-xl border border-destructive/20 space-y-1.5 animate-pulse">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Processing Error
                    </div>
                    <p className="leading-relaxed opacity-90 select-text font-medium">{doc.errorMessage}</p>
                  </div>
                )}

                {/* Details Statistics Card grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-xl bg-card hover:bg-muted/10 transition-colors shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      Chunks Created
                    </div>
                    <div className="text-2xl font-black text-foreground">{doc.chunkCount}</div>
                  </div>

                  <div className="p-4 border border-border rounded-xl bg-card hover:bg-muted/10 transition-colors shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1.5">
                      <Database className="h-3.5 w-3.5 text-primary" />
                      Vector Status
                    </div>
                    <div className="text-xs font-black text-foreground uppercase tracking-wide bg-primary/10 text-primary px-2.5 py-1.5 rounded-lg inline-block w-fit">
                      {doc.embeddingStatus || "PENDING"}
                    </div>
                  </div>
                </div>

                {/* File size & upload timestamp summary */}
                <div className="space-y-3.5 border border-border rounded-xl p-4 bg-muted/10 shadow-sm">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
                      File Size
                    </span>
                    <span className="text-foreground font-extrabold">{formatFileSize(doc.sizeBytes)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-semibold border-t border-border/50 pt-3">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      Uploaded On
                    </span>
                    <span className="text-foreground/90 font-mono font-bold">
                      {formatUploadedDate(doc.uploadedAt)}
                    </span>
                  </div>

                  {doc.storageKey && (
                    <div className="flex justify-between items-start gap-4 text-xs font-semibold border-t border-border/50 pt-3">
                      <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                        <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        Storage Key
                      </span>
                      <span className="text-foreground/75 font-mono break-all text-right font-medium max-w-[240px] select-all">
                        {doc.storageKey}
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata JSON card */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Info className="h-3.5 w-3.5" />
                    Metadata Attributes
                  </div>
                  {doc.metadata && Object.keys(doc.metadata).length > 0 ? (
                    <pre className="bg-muted p-4 rounded-xl text-xs font-mono text-foreground overflow-x-auto border border-border leading-relaxed select-text shadow-inner">
                      {JSON.stringify(doc.metadata, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-4 border border-dashed border-border rounded-xl text-center text-xs italic text-muted-foreground/60 select-none bg-muted/20">
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
