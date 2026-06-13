import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { type OrganizationMember } from "../types/team.types"
import { MemberActions } from "./MemberActions"
import { EmptyState } from "@/components/common/EmptyState"

interface MembersTableProps {
  members: OrganizationMember[]
}

export const MembersTable = React.memo(({ members }: MembersTableProps) => {
  const renderRoleBadge = (role: OrganizationMember["role"]) => {
    switch (role) {
      case "OWNER":
        return (
          <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            OWNER
          </span>
        )
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            ADMIN
          </span>
        )
      case "MEMBER":
        return (
          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            MEMBER
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-500/10 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            VIEWER
          </span>
        )
    }
  }

  const renderStatus = (status: OrganizationMember["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
            Active
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2.5 py-0.5 rounded-full text-xs font-medium animate-pulse">
            Pending
          </span>
        )
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardContent className="p-0">
        {members.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No members found"
              description="Invite other team members to collaborate."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/30">
                    <TableCell className="py-4 font-semibold text-foreground">
                      {member.firstName} {member.lastName}
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground">{member.email}</TableCell>
                    <TableCell className="py-4">{renderRoleBadge(member.role)}</TableCell>
                    <TableCell className="py-4">{renderStatus(member.status)}</TableCell>
                    <TableCell className="py-4 text-muted-foreground">{formatDate(member.joinedAt)}</TableCell>
                    <TableCell className="py-4 align-middle text-right">
                      <MemberActions member={member} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

MembersTable.displayName = "MembersTable"
