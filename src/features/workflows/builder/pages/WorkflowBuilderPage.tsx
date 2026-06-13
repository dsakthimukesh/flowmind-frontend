import { useState, useEffect } from "react"
import { useParams, useBlocker } from "react-router"
import { ReactFlowProvider } from "reactflow"
import { AlertTriangle } from "lucide-react"

import { ErrorState } from "@/components/common/ErrorState"
import { useWorkflowBuilder } from "../hooks/useWorkflowBuilder"
import { useSaveWorkflowVersion } from "../hooks/useWorkflowPersistence"
import { BuilderHeader } from "../components/BuilderHeader"
import { NodePalette } from "../components/NodePalette"
import { WorkflowCanvas } from "../components/WorkflowCanvas"
import { CanvasToolbar } from "../components/CanvasToolbar"
import { WorkflowSkeleton } from "../../components/WorkflowSkeleton"
import { NodeConfigPanel } from "../config/NodeConfigPanel"
import { NodeConfigDrawer } from "../config/NodeConfigDrawer"
import { useWorkflowValidation } from "../validation/hooks/useWorkflowValidation"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"
import { ValidationPanel } from "../validation/components/ValidationPanel"
import { ValidationBadge } from "../validation/components/ValidationBadge"
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts"

// Dialog components for the draft recovery prompt
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const WorkflowBuilderPage = () => {
  const { workflowId } = useParams<{ workflowId: string }>()
  const wId = workflowId || ""

  // Initialize auto-validation engine
  useWorkflowValidation()

  const selectedNode = useWorkflowBuilderStore((state) => state.selectedNode)
  const isDirty = useWorkflowBuilderStore((state) => state.isDirty)
  const setDirty = useWorkflowBuilderStore((state) => state.setDirty)
  const restoreDraft = useWorkflowBuilderStore((state) => state.restoreDraft)
  
  const [activeTab, setActiveTab] = useState<"config" | "validation">("config")
  const [draftToRestore, setDraftToRestore] = useState<{ nodes: any[]; edges: any[] } | null>(null)

  useEffect(() => {
    if (selectedNode) {
      setActiveTab("config")
    }
  }, [selectedNode])

  // Load active builder workspace
  const { workflow, version, isLoading, isError, refetch } = useWorkflowBuilder(wId)

  // Recovery Draft Detection on Mount / Version Load
  useEffect(() => {
    if (version) {
      const draftKey = `flowmind_draft_${wId}`
      const savedDraft = localStorage.getItem(draftKey)
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft)
          const dbTime = new Date(version.createdAt).getTime()
          
          // Show recovery prompt if local draft has a newer timestamp and contains nodes
          if (parsed.timestamp && parsed.timestamp > dbTime && parsed.nodes?.length > 0) {
            setDraftToRestore(parsed)
          }
        } catch (err) {
          console.error("Failed to parse local draft", err)
        }
      }
    }
  }, [version, wId])

  // 30-Second Local Autosave Loop
  useEffect(() => {
    if (!version) return

    const interval = setInterval(() => {
      const state = useWorkflowBuilderStore.getState()
      if (state.isDirty && state.nodes.length > 0) {
        localStorage.setItem(
          `flowmind_draft_${wId}`,
          JSON.stringify({
            nodes: state.nodes,
            edges: state.edges,
            timestamp: Date.now(),
          })
        )
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [wId, version])

  // Navigation Protection: Window tab exit blocker
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = "You have unsaved changes. Leave anyway?"
        return e.returnValue
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  // Navigation Protection: SPA React Router transitions blocker
  const blocker = useBlocker(({ nextLocation }) => {
    // Block transitions that navigate out of this specific builder page
    return isDirty && nextLocation.pathname !== `/workflows/${wId}/builder`
  })

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm("You have unsaved changes. Leave anyway?")
      if (confirmLeave) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker])

  // Persistent save actions
  const { mutate: saveVersion, isPending: isSaving } = useSaveWorkflowVersion(wId, () => {
    // Clear autosave draft on successful database save
    localStorage.removeItem(`flowmind_draft_${wId}`)
    setDirty(false)
  })

  const handleSave = () => {
    saveVersion()
  }

  // Register Keyboard Hotkeys hook
  useKeyboardShortcuts({ onSave: handleSave })

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col justify-center">
        <WorkflowSkeleton />
      </div>
    )
  }

  if (isError || !workflow) {
    return (
      <div className="h-screen flex flex-col">
        <BuilderHeader workflowId={wId} />
        <div className="flex-1 flex items-center justify-center p-6">
          <ErrorState
            title="Failed to load editor"
            message="We had trouble launching the workspace canvas. Please verify your connection."
            onRetry={refetch}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Top Banner Header */}
      <BuilderHeader
        workflowId={wId}
        workflowName={workflow.name}
        versionNumber={version?.versionNumber}
        isPublished={version?.isPublished}
      />

      {/* Main Builder Area */}
      <div className="flex flex-1 h-full min-h-0 overflow-hidden relative">
        {/* Left Side: Drag & Drop Node Selectors */}
        <NodePalette />

        {/* Center: React Flow Canvas Viewport Wrapper */}
        <ReactFlowProvider>
          <div className="flex-1 h-full w-full relative flex">
            <WorkflowCanvas />
            
            {/* Overlay Toolbar containing Zoom actions & Secures Save version */}
            <CanvasToolbar
              onSave={handleSave}
              isSaving={isSaving}
              onValidate={() => setActiveTab("validation")}
            />
          </div>
        </ReactFlowProvider>

        {/* Right Side: Desktop Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col h-full w-80 border-l border-border bg-card/90 shrink-0">
          {/* Tabs header */}
          <div className="flex border-b border-border bg-muted/40 p-1.5 shrink-0">
            <button
              id="sidebar-tab-config"
              onClick={() => setActiveTab("config")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "config"
                  ? "bg-card text-primary shadow-sm border border-border/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Configuration
            </button>
            <button
              id="sidebar-tab-validation"
              onClick={() => setActiveTab("validation")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === "validation"
                  ? "bg-card text-primary shadow-sm border border-border/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Validation
              <ValidationBadge />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            {activeTab === "config" ? (
              <NodeConfigPanel />
            ) : (
              <ValidationPanel />
            )}
          </div>
        </div>

        {/* Drawer overlay for Mobile (Hidden on Desktop) */}
        <div className="lg:hidden">
          <NodeConfigDrawer />
        </div>
      </div>

      {/* Recover draft dialog modal prompt */}
      {draftToRestore && (
        <Dialog open={!!draftToRestore} onOpenChange={(open) => !open && setDraftToRestore(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Autosaved Draft Found
              </DialogTitle>
              <DialogDescription className="pt-2 text-xs leading-normal">
                We found an autosaved draft of this workflow from your local storage that is newer than the saved version. Do you want to restore it?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem(`flowmind_draft_${wId}`)
                  setDraftToRestore(null)
                }}
                className="text-xs"
              >
                Discard Draft
              </Button>
              <Button
                onClick={() => {
                  if (draftToRestore) {
                    restoreDraft(draftToRestore.nodes, draftToRestore.edges)
                  }
                  setDraftToRestore(null)
                }}
                className="text-xs"
              >
                Restore Draft
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
