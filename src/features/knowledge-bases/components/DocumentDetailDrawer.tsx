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
        <SheetContent className="w-full sm:max-w-[550px] md:max-w-[600px] overflow-y-auto border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
          <SheetHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-900">
            <SheetTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-bold text-lg">
              <FileText className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
              Document Library Detail
            </SheetTitle>
            <SheetDescription className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 break-all select-all">
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
              <AlertTriangle className="h-10 w-10 text-zinc-900 dark:text-zinc-100 mx-auto animate-bounce" />
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Failed to load details</p>
              <p className="text-xs text-zinc-500">Please try closing and reopening the drawer.</p>
            </div>
          ) : (
            doc && (
              <div className="space-y-6 py-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Visual Header Block */}
                <div className="flex items-center gap-3.5 bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-xs font-black shrink-0 flex items-center justify-center h-12 w-12 shadow-sm">
                    {doc.name.split('.').pop()?.toUpperCase().slice(0, 4) || "DOC"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug break-all select-all">
                      {doc.name}
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-semibold mt-0.5 capitalize">
                      Format: {doc.name.split('.').pop() || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Processing Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <DocumentStatusBadge status={doc.status} />
                  </div>
                </div>

                {/* Error Banner if failed */}
                {doc.status === "FAILED" && doc.errorMessage && (
                  <div className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-500/20 space-y-1.5 animate-pulse">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Processing Error
                    </div>
                    <p className="leading-relaxed opacity-90 select-text font-medium">{doc.errorMessage}</p>
                  </div>
                )}

                {/* Details Statistics Card grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition-colors shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">
                      <Layers className="h-3.5 w-3.5 text-zinc-400" />
                      Chunks Created
                    </div>
                    <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{doc.chunkCount}</div>
                  </div>

                  <div className="p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition-colors shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">
                      <Database className="h-3.5 w-3.5 text-zinc-400" />
                      Vector Status
                    </div>
                    <div className="text-[11px] font-black text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg inline-block w-fit uppercase tracking-wide">
                      {doc.embeddingStatus || "PENDING"}
                    </div>
                  </div>
                </div>

                {/* File size & upload timestamp summary */}
                <div className="space-y-3.5 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/30 dark:bg-zinc-900/10 shadow-sm">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <HardDrive className="h-3.5 w-3.5 text-zinc-400" />
                      File Size
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-50 font-extrabold">{formatFileSize(doc.sizeBytes)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-semibold border-t border-zinc-100 dark:border-zinc-900 pt-3">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      Uploaded On
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-50 font-mono font-bold">
                      {formatUploadedDate(doc.uploadedAt)}
                    </span>
                  </div>

                  {doc.storageKey && (
                    <div className="flex justify-between items-center gap-4 text-xs font-semibold border-t border-zinc-100 dark:border-zinc-900 pt-3">
                      <span className="text-zinc-500 flex items-center gap-1.5 shrink-0">
                        <FolderOpen className="h-3.5 w-3.5 text-zinc-400" />
                        Storage Key
                      </span>
                      <span className="text-zinc-900 dark:text-zinc-50 font-mono text-[11px] select-all bg-zinc-100/80 dark:bg-zinc-900/80 px-2 py-1 rounded max-w-[260px] truncate" title={doc.storageKey}>
                        {doc.storageKey}
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata JSON card */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    <Info className="h-3.5 w-3.5" />
                    Metadata Attributes
                  </div>
                  {doc.metadata && Object.keys(doc.metadata).length > 0 ? (
                    <pre className="bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl text-xs font-mono text-zinc-900 dark:text-zinc-100 overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 leading-relaxed select-text shadow-inner">
                      {JSON.stringify(doc.metadata, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-xs italic text-zinc-400 select-none bg-zinc-50/20 dark:bg-zinc-900/10">
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
