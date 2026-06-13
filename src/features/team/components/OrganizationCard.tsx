import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building, Award, Calendar, Users, Globe } from "lucide-react"
import { type OrganizationDetail } from "../types/team.types"

interface OrganizationCardProps {
  organization: OrganizationDetail
}

export const OrganizationCard = React.memo(({ organization }: OrganizationCardProps) => {
  const formattedDate = new Date(organization.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const count = organization.members ? organization.members.length : (organization.memberCount || 0)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          {organization.name}
        </CardTitle>
        <CardDescription>Workspace metadata and properties.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Award className="h-4 w-4" /> Plan level
          </span>
          <span className="text-sm font-semibold capitalize bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs">
            {organization.plan}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-4 w-4" /> Slug URL
          </span>
          <span className="text-sm font-semibold text-muted-foreground">{organization.slug}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Workspace Members
          </span>
          <span className="text-sm font-semibold">{count} members</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> Created Date
          </span>
          <span className="text-sm font-medium text-muted-foreground">{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  )
})

OrganizationCard.displayName = "OrganizationCard"
