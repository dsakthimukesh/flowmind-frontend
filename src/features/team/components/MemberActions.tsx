import React, { useState } from "react"
import { MoreHorizontal, Shield, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { type OrganizationMember } from "../types/team.types"
import { RemoveMemberDialog } from "./RemoveMemberDialog"
import { useAuthStore } from "@/stores/authStore"
import { useUpdateMemberRole } from "../hooks/useUpdateMemberRole"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MemberActionsProps {
  member: OrganizationMember
}

export const MemberActions = React.memo(({ member }: MemberActionsProps) => {
  const currentUser = useAuthStore((state) => state.user)
  const currentRole = useAuthStore((state) => state.role)
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateMemberRole()
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Hide actions for self or for OWNER rows
  const isSelf = currentUser?.id === member.id
  const isOwnerRow = member.role === "OWNER"

  // RBAC checks
  const canChangeRole = currentRole === "OWNER" && !isSelf && !isOwnerRow
  const canRemove = (currentRole === "OWNER" || currentRole === "ADMIN") && !isSelf && !isOwnerRow

  if (!canChangeRole && !canRemove) {
    return null
  }

  const handleRoleChange = (newRole: string) => {
    updateRole({
      userId: member.id,
      data: { role: newRole as "ADMIN" | "MEMBER" | "VIEWER" },
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" disabled={isUpdatingRole}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Change Role Selection */}
          {canChangeRole && (
            <div className="px-2 py-1.5 space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <Shield className="h-3 w-3" /> Change Role
              </span>
              <Select defaultValue={member.role} onValueChange={handleRoleChange} disabled={isUpdatingRole}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="MEMBER">MEMBER</SelectItem>
                  <SelectItem value="VIEWER">VIEWER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {canChangeRole && canRemove && <DropdownMenuSeparator />}

          {/* Remove Member Trigger */}
          {canRemove && (
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Remove Member</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation */}
      {canRemove && (
        <RemoveMemberDialog
          member={member}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
    </>
  )
})

MemberActions.displayName = "MemberActions"
