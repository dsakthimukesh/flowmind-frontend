import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Award, Users, Calendar } from "lucide-react"
import { type OrganizationSummary } from "../types/dashboard.types"

interface OrganizationOverviewProps {
  organization: OrganizationSummary
}

export const OrganizationOverview = React.memo(({ organization }: OrganizationOverviewProps) => {
  const formattedDate = new Date(organization.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Organization Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-sm text-muted-foreground">Name</span>
          <span className="text-sm font-semibold">{organization.name}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Award className="h-4 w-4 text-muted-foreground" /> Plan
          </span>
          <span className="text-sm font-semibold capitalize bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs">
            {organization.plan}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" /> Active Members
          </span>
          <span className="text-sm font-semibold">{organization.memberCount} members</span>
        </div>
        <div className="flex items-center justify-between pb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" /> Created At
          </span>
          <span className="text-sm font-semibold text-muted-foreground">{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  )
})

OrganizationOverview.displayName = "OrganizationOverview"
