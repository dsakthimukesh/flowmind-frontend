import { useState, useMemo } from "react"
import { Search, LayoutGrid, List } from "lucide-react"
import { PageContainer } from "@/components/common/PageContainer"
import { PageHeader } from "@/components/common/PageHeader"
import { ApiKeyWarning } from "../components/ApiKeyWarning"
import { ApiKeysTable } from "../components/ApiKeysTable"
import { ApiKeyCard } from "../components/ApiKeyCard"
import { CreateApiKeyDialog } from "../components/CreateApiKeyDialog"
import { ApiKeyCreatedDialog } from "../components/ApiKeyCreatedDialog"
import { RevokeApiKeyDialog } from "../components/RevokeApiKeyDialog"
import { ApiKeyTableSkeleton } from "../components/ApiKeySkeleton"
import { useApiKeys } from "../hooks/useApiKeys"
import { useAuthStore } from "@/stores/authStore"
import { ErrorState } from "@/components/common/ErrorState"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { type ApiKeyCreatedResponse } from "../types/apiKey.types"

export const ApiKeysPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchTerm, setSearchTerm] = useState("")

  // One-time key display state
  const [createdKey, setCreatedKey] = useState<ApiKeyCreatedResponse | null>(null)
  const [createdDialogOpen, setCreatedDialogOpen] = useState(false)

  // Revocation state
  const [revokeKeyId, setRevokeKeyId] = useState<string | null>(null)
  const [revokeKeyName, setRevokeKeyName] = useState<string | null>(null)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)

  // RBAC checks
  const role = useAuthStore((state) => state.role)
  const canModify = role === "OWNER" || role === "ADMIN"

  const { data: apiKeysResponse, isLoading, error, refetch } = useApiKeys()
  const apiKeys = apiKeysResponse?.data || []

  // Filter keys by search query
  const filteredKeys = useMemo(() => {
    return apiKeys.filter((key) => key.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [apiKeys, searchTerm])

  const handleCreatedSuccess = (data: ApiKeyCreatedResponse) => {
    setCreatedKey(data)
    setCreatedDialogOpen(true)
  }

  const handleRevokeClick = (id: string, name: string) => {
    setRevokeKeyId(id)
    setRevokeKeyName(name)
    setRevokeDialogOpen(true)
  }

  const handleRevokeClose = () => {
    setRevokeKeyId(null)
    setRevokeKeyName(null)
    setRevokeDialogOpen(false)
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="API Keys"
          description="Manage API keys to trigger workflows and interface programmatically with FlowMind AI."
          actions={canModify ? <CreateApiKeyDialog onSuccess={handleCreatedSuccess} /> : undefined}
        />

        {/* Security Warning Advisory */}
        <ApiKeyWarning />

        {error ? (
          <ErrorState
            title="Failed to load API keys"
            message={error.message || "An unexpected error occurred while fetching API keys."}
            onRetry={refetch}
          />
        ) : (
          <div className="space-y-4">
            {/* Search and Layout Grid Toggles */}
            {apiKeys.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search API keys..."
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

            {/* List and Grid Loading Viewport */}
            {isLoading ? (
              <ApiKeyTableSkeleton />
            ) : filteredKeys.length === 0 ? (
              <div className="p-12 border border-dashed border-border rounded-xl bg-card text-center select-none">
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-foreground">No API keys found</h3>
                  <p className="text-sm text-muted-foreground font-semibold">
                    {searchTerm
                      ? "No keys match your query term."
                      : "Generate your first programmatic API Key to get started."}
                  </p>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredKeys.map((key) => (
                  <ApiKeyCard
                    key={key.id}
                    apiKey={key}
                    onRevoke={handleRevokeClick}
                    canModify={canModify}
                  />
                ))}
              </div>
            ) : (
              <ApiKeysTable
                apiKeys={filteredKeys}
                onRevoke={handleRevokeClick}
                canModify={canModify}
              />
            )}
          </div>
        )}
      </div>

      {/* Disclosures overlay components */}
      <ApiKeyCreatedDialog
        data={createdKey}
        open={createdDialogOpen}
        onClose={() => {
          setCreatedDialogOpen(false)
          setCreatedKey(null)
        }}
      />

      <RevokeApiKeyDialog
        id={revokeKeyId}
        name={revokeKeyName || ""}
        open={revokeDialogOpen}
        onClose={handleRevokeClose}
      />
    </PageContainer>
  )
}
