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
import { Loader2 } from "lucide-react"
import { useRemoveMember } from "../hooks/useRemoveMember"
import { type OrganizationMember } from "../types/team.types"

interface RemoveMemberDialogProps {
  member: OrganizationMember
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const RemoveMemberDialog = React.memo(({ member, open, onOpenChange }: RemoveMemberDialogProps) => {
  const { mutate: remove, isPending } = useRemoveMember(() => onOpenChange(false))

  const handleConfirm = () => {
    remove(member.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Remove Workspace Member
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to remove <strong>{member.firstName} {member.lastName}</strong> ({member.email}) from the workspace?
            This action cannot be undone and they will lose all access immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button id="remove-member-cancel" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button id="remove-member-confirm" variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

RemoveMemberDialog.displayName = "RemoveMemberDialog"
