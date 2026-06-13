import React from "react"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteApiKey } from "../hooks/useDeleteApiKey"

interface RevokeApiKeyDialogProps {
  id: string | null
  name?: string
  open: boolean
  onClose: () => void
}

export const RevokeApiKeyDialog = React.memo(
  ({ id, name, open, onClose }: RevokeApiKeyDialogProps) => {
    const { mutateAsync: deleteKey, isPending } = useDeleteApiKey()

    const handleRevoke = async () => {
      if (!id) return
      try {
        await deleteKey(id)
        toast.success("API key revoked successfully")
        onClose()
      } catch {
        toast.error("Failed to revoke API key")
      }
    }

    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Revoke API Key
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-muted-foreground font-semibold leading-relaxed">
              Are you sure you want to revoke the API key{name ? ` "${name}"` : ""}? Any services or integrations using this key will immediately fail. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 gap-2">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke} disabled={isPending}>
              {isPending ? "Revoking..." : "Revoke Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

RevokeApiKeyDialog.displayName = "RevokeApiKeyDialog"
