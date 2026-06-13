import React from "react"
import { useReactFlow } from "reactflow"
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Loader2,
  Save,
  Undo2,
  Redo2,
  Network,
  ClipboardCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"
import { animateLayout } from "../utils/autoLayout"

// Shadcn Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CanvasToolbarProps {
  onSave: () => void
  isSaving: boolean
  onValidate?: () => void
}

// Tooltip helper component for the keyboard shortcuts layout
const ShortcutTooltip = ({
  children,
  content,
}: {
  children: React.ReactNode
  content: React.ReactNode
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" className="flex items-center gap-2 select-none">
        {content}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export const CanvasToolbar = React.memo(
  ({ onSave, isSaving, onValidate }: CanvasToolbarProps) => {
    const { zoomIn, zoomOut, fitView } = useReactFlow()
    const currentRole = useAuthStore((state) => state.role)
    
    const {
      nodes,
      edges,
      setNodes,
      takeSnapshot,
      undo,
      redo,
      past,
      future,
    } = useWorkflowBuilderStore()

    const canSave = currentRole === "OWNER" || currentRole === "ADMIN"

    const handleAutoLayout = () => {
      animateLayout(nodes, edges, setNodes, takeSnapshot)
    }

    return (
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 bg-card/90 border border-border p-2 rounded-xl shadow-lg backdrop-blur-sm select-none">
        {/* Group 1: Undo & Redo History */}
        <div className="flex items-center gap-0.5">
          <ShortcutTooltip
            content={
              <div className="flex items-center gap-1.5 text-xs text-background font-medium">
                <span>Undo</span>
                <kbd className="bg-muted/30 px-1 py-0.25 rounded text-[10px] border border-border/20 text-background">Ctrl+Z</kbd>
              </div>
            }
          >
            <Button
              id="toolbar-undo"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={undo}
              disabled={past.length === 0}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </ShortcutTooltip>

          <ShortcutTooltip
            content={
              <div className="flex items-center gap-1.5 text-xs text-background font-medium">
                <span>Redo</span>
                <kbd className="bg-muted/30 px-1 py-0.25 rounded text-[10px] border border-border/20 text-background">Ctrl+Shift+Z</kbd>
              </div>
            }
          >
            <Button
              id="toolbar-redo"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={redo}
              disabled={future.length === 0}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </ShortcutTooltip>
        </div>

        <div className="w-[1px] h-5 bg-border mx-1" />

        {/* Group 2: Canvas Camera Positioning Controls */}
        <div className="flex items-center gap-0.5">
          <ShortcutTooltip content={<span className="text-xs text-background font-medium">Zoom In</span>}>
            <Button
              id="toolbar-zoom-in"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => zoomIn()}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </ShortcutTooltip>

          <ShortcutTooltip content={<span className="text-xs text-background font-medium">Zoom Out</span>}>
            <Button
              id="toolbar-zoom-out"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => zoomOut()}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </ShortcutTooltip>

          <ShortcutTooltip content={<span className="text-xs text-background font-medium">Zoom to Fit</span>}>
            <Button
              id="toolbar-fit-view"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => fitView({ duration: 300 })}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </ShortcutTooltip>
        </div>

        <div className="w-[1px] h-5 bg-border mx-1" />

        {/* Group 3: Auto Layout Alignment */}
        <ShortcutTooltip content={<span className="text-xs text-background font-medium">Auto Layout (Align Nodes)</span>}>
          <Button
            id="toolbar-auto-layout"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={handleAutoLayout}
            disabled={nodes.length === 0}
          >
            <Network className="h-4 w-4" />
          </Button>
        </ShortcutTooltip>

        {/* Group 4: Validate Action & Save Version */}
        {onValidate && (
          <>
            <div className="w-[1px] h-5 bg-border mx-1" />
            <ShortcutTooltip content={<span className="text-xs text-background font-medium">Open Validation Panel</span>}>
              <Button
                id="toolbar-validate"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={onValidate}
              >
                <ClipboardCheck className="h-4 w-4" />
              </Button>
            </ShortcutTooltip>
          </>
        )}

        {canSave && (
          <>
            <div className="w-[1px] h-5 bg-border mx-1" />
            <ShortcutTooltip
              content={
                <div className="flex items-center gap-1.5 text-xs text-background font-medium">
                  <span>Save Version</span>
                  <kbd className="bg-muted/30 px-1 py-0.25 rounded text-[10px] border border-border/20 text-background">Ctrl+S</kbd>
                </div>
              }
            >
              <Button
                id="toolbar-save-version"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="rounded-lg text-xs"
              >
                {isSaving ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                )}
                Save Version
              </Button>
            </ShortcutTooltip>
          </>
        )}
      </div>
    )
  }
)

CanvasToolbar.displayName = "CanvasToolbar"
