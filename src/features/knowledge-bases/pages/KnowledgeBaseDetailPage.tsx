import React, { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeft, RefreshCw, FileText } from "lucide-react"
import { PageContainer } from "@/components/common/PageContainer"
import { Button } from "@/components/ui/button"
import { useKnowledgeBase } from "../hooks/useKnowledgeBase"
import { useDocuments } from "../hooks/useDocuments"
import { useAuthStore } from "@/stores/authStore"
import { KnowledgeBaseStats } from "../components/KnowledgeBaseStats"
import { DocumentTable } from "../components/DocumentTable"
import { UploadDocumentDialog } from "../components/UploadDocumentDialog"
import { DocumentDetailDrawer } from "../components/DocumentDetailDrawer"
import { KnowledgeBaseStatsSkeleton, DocumentTableSkeleton } from "../components/KnowledgeBaseSkeleton"
import { ErrorState } from "@/components/common/ErrorState"
import { toast } from "sonner"
import { useDeleteDocument } from "../hooks/useDeleteDocument"

export const KnowledgeBaseDetailPage = () => {
  const { knowledgeBaseId } = useParams<{ knowledgeBaseId: string }>()
  const navigate = useNavigate()
  const role = useAuthStore((state) => state.role)
  const canUpload = role === "OWNER" || role === "ADMIN"

  const kbId = knowledgeBaseId || ""

  // Details and files fetch hooks
  const {
    data: kbResponse,
    isLoading: isLoadingKb,
    error: kbError,
    refetch: refetchKb,
    isRefetching: isRefetchingKb,
  } = useKnowledgeBase(kbId)

  const {
    data: docsResponse,
    isLoading: isLoadingDocs,
    error: docsError,
    refetch: refetchDocs,
    isRefetching: isRefetchingDocs,
  } = useDocuments(kbId)

  const { mutateAsync: deleteDoc } = useDeleteDocument()

  // Document details drawer state
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchKb(), refetchDocs()])
      toast.success("Document library updated")
    } catch {
      toast.error("Failed to refresh library data")
    }
  }

  const handleViewDetails = (docId: string) => {
    setSelectedDocId(docId)
    setDrawerOpen(true)
  }

  const handleDeleteDocument = async (docId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document? This action cannot be undone."
    )
    if (!confirmDelete) return

    try {
      await deleteDoc({ kbId, docId })
      toast.success("Document deleted successfully")
      refetchDocs()
    } catch {
      toast.error("Failed to delete document")
    }
  }

  const isRefreshing = isRefetchingKb || isRefetchingDocs
  const hasError = !!kbError || !!docsError
  const isLoading = isLoadingKb || isLoadingDocs

  const kb = kbResponse?.data
  const documents = docsResponse?.data || []

  // Compute stats locally from documents list
  const stats = React.useMemo(() => {
    const total = documents.length
    const processed = documents.filter((d) => d.status === "PROCESSED").length
    const failed = documents.filter((d) => d.status === "FAILED").length
    const pending = documents.filter((d) => d.status === "PENDING" || d.status === "PROCESSING").length
    return { total, processed, failed, pending }
  }, [documents])

  if (hasError) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate("/knowledge-bases")} className="h-8 w-8 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Knowledge Base Details</h1>
          </div>
          <ErrorState
            title="Failed to load details"
            message={kbError?.message || docsError?.message || "Something went wrong loading this Knowledge Base."}
            onRetry={handleRefresh}
          />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header section with titles and upload dial triggers */}
        <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Button
              variant="outline"
              size="icon"
              className="mt-1 h-8 w-8 shrink-0 rounded-lg"
              onClick={() => navigate("/knowledge-bases")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {kb ? kb.name : "Loading..."}
              </h1>
              {kb?.description && <p className="text-sm text-muted-foreground">{kb.description}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {kb && canUpload && <UploadDocumentDialog kbId={kbId} />}
          </div>
        </div>

        {isLoading && !kb ? (
          <div className="space-y-6">
            <KnowledgeBaseStatsSkeleton />
            <DocumentTableSkeleton />
          </div>
        ) : (
          kb && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Statistics Card Panels */}
              <KnowledgeBaseStats stats={stats} />

              {/* Document Library Table */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground px-1">
                  <FileText className="h-4 w-4 text-primary" />
                  Document Library
                </div>
                <DocumentTable
                  documents={documents}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteDocument}
                />
              </div>

              {/* Drawer View overlay */}
              <DocumentDetailDrawer
                kbId={kbId}
                docId={selectedDocId}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              />
            </div>
          )
        )}
      </div>
    </PageContainer>
  )
}
