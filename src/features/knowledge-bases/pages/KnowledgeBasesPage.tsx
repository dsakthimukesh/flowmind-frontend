import { useState } from "react"
import { LayoutGrid, List, Search } from "lucide-react"
import { PageContainer } from "@/components/common/PageContainer"
import { PageHeader } from "@/components/common/PageHeader"
import { KnowledgeBaseCard } from "../components/KnowledgeBaseCard"
import { KnowledgeBaseTable } from "../components/KnowledgeBaseTable"
import { CreateKnowledgeBaseDialog } from "../components/CreateKnowledgeBaseDialog"
import { KnowledgeBaseCardSkeleton, KnowledgeBaseTableSkeleton } from "../components/KnowledgeBaseSkeleton"
import { useKnowledgeBases } from "../hooks/useKnowledgeBases"
import { useAuthStore } from "@/stores/authStore"
import { ErrorState } from "@/components/common/ErrorState"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const KnowledgeBasesPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")

  const role = useAuthStore((state) => state.role)
  const canCreate = role === "OWNER" || role === "ADMIN"

  const { data: kbResponse, isLoading, error, refetch } = useKnowledgeBases()
  const kbs = kbResponse?.data || []

  // Filter list by search query
  const filteredKbs = kbs.filter(
    (kb) =>
      kb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kb.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Knowledge Bases"
          description="Upload documents and train vector engines for AI context lookup."
          actions={canCreate ? <CreateKnowledgeBaseDialog /> : undefined}
        />

        {error ? (
          <ErrorState
            title="Failed to load Knowledge Bases"
            message={error.message || "An unexpected error occurred while fetching knowledge bases."}
            onRetry={refetch}
          />
        ) : (
          <div className="space-y-4">
            {/* Search and Layout Grid Toggles */}
            {kbs.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search knowledge bases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg self-end sm:self-auto">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 rounded-md p-1"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="sr-only">Grid View</span>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 rounded-md p-1"
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List View</span>
                  </Button>
                </div>
              </div>
            )}

            {/* List and Grid Loading viewport */}
            {isLoading ? (
              viewMode === "grid" ? (
                <KnowledgeBaseCardSkeleton />
              ) : (
                <KnowledgeBaseTableSkeleton />
              )
            ) : filteredKbs.length === 0 ? (
              <div className="p-12 border border-dashed border-border rounded-xl bg-card text-center">
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-foreground">No knowledge bases found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search criteria to locate matching records."
                      : "Create your first knowledge base vector engine to get started."}
                  </p>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredKbs.map((kb) => (
                  <KnowledgeBaseCard key={kb.id} kb={kb} />
                ))}
              </div>
            ) : (
              <KnowledgeBaseTable knowledgeBases={filteredKbs} />
            )}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
