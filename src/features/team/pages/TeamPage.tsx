import { useState } from "react"
import { Plus } from "lucide-react"

import { PageContainer } from "@/components/common/PageContainer"
import { PageHeader } from "@/components/common/PageHeader"
import { ErrorState } from "@/components/common/ErrorState"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"

import { useOrganization } from "../hooks/useOrganization"
import { useMembers } from "../hooks/useMembers"
import { OrganizationCard } from "../components/OrganizationCard"
import { MembersTable } from "../components/MembersTable"
import { InviteMemberDialog } from "../components/InviteMemberDialog"
import { TeamSkeleton } from "../components/TeamSkeleton"

export const TeamPage = () => {
  const currentRole = useAuthStore((state) => state.role)
  const [inviteOpen, setInviteOpen] = useState(false)

  const orgQuery = useOrganization()
  const membersQuery = useMembers()

  const isLoading = orgQuery.isLoading || membersQuery.isLoading
  const isError = orgQuery.isError || membersQuery.isError

  const handleRetry = () => {
    orgQuery.refetch()
    membersQuery.refetch()
  }

  // RBAC checks for Invite Member button
  const canInvite = currentRole === "OWNER" || currentRole === "ADMIN"

  if (isLoading) {
    return <TeamSkeleton />
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Team Members" description="Invite collaborators and manage user roles." />
        <ErrorState
          title="Organization data unavailable"
          message="Failed to load organization or members details. Please verify your connection."
          onRetry={handleRetry}
        />
      </PageContainer>
    )
  }

  const organization = orgQuery.data?.data
  const members = membersQuery.data?.data || []

  return (
    <PageContainer>
      <PageHeader
        title="Team Members"
        description="Invite collaborators and manage user roles."
        actions={
          canInvite && (
            <Button onClick={() => setInviteOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Invite Member
            </Button>
          )
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Organization Details */}
        {organization ? (
          <div className="md:col-span-1">
            <OrganizationCard organization={organization} />
          </div>
        ) : (
          <div className="md:col-span-1">
            <EmptyState
              title="Organization data unavailable"
              description="Could not find organization metadata."
            />
          </div>
        )}

        {/* Right Column: Members Listing */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Workspace Members</h2>
          </div>
          <MembersTable members={members} />
        </div>
      </div>

      {/* Invite Member Popup Dialog */}
      {canInvite && (
        <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      )}
    </PageContainer>
  )
}
