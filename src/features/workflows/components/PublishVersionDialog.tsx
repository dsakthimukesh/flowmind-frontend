import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Rocket, AlertCircle } from "lucide-react"
import { usePublishWorkflow } from "../hooks/usePublishWorkflow"
import { type WorkflowVersion } from "../types/workflow.types"
import { validateWorkflow } from "../builder/validation/WorkflowValidator"

interface PublishVersionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  version: WorkflowVersion | null
  workflowId: string
}

export const PublishVersionDialog = React.memo(
  ({ open, onOpenChange, version, workflowId }: PublishVersionDialogProps) => {
    const { mutate: publish, isPending } = usePublishWorkflow(workflowId, () => {
      onOpenChange(false)
    })

    if (!version) return null

    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    const handleConfirm = () => {
      publish(version.id)
    }

    // Validate version definition definition before publishing
    const nodes = version.definition?.nodes || []
    const edges = version.definition?.edges || []
    const validation = validateWorkflow(nodes, edges)
    const isValid = validation.valid

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Rocket className="h-5 w-5 text-primary" /> Publish Workflow Version
            </DialogTitle>
            <DialogDescription className="pt-2">
              You are about to publish <strong>Version {version.versionNumber}</strong> of this workflow. 
              This will make it the active release version for any future execution trigger runs.
            </DialogDescription>
          </DialogHeader>

          {/* Validation block banner */}
          {!isValid && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 my-2 text-xs text-destructive flex items-start gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-destructive shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Cannot Publish:</span> Fix validation errors before publishing.
              </div>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4 space-y-2.5 my-2 border border-border text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version Number:</span>
              <span className="font-semibold text-foreground">v{version.versionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created Date:</span>
              <span className="text-foreground">{formatDate(version.createdAt)}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              id="publish-cancel-button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              id="publish-confirm-button"
              onClick={handleConfirm}
              disabled={isPending || !isValid}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

PublishVersionDialog.displayName = "PublishVersionDialog"
