import { useState, useEffect } from "react"
import { Search, Calendar, FilterX } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { type AuditLogFilters } from "../types/auditLog.types"

interface AuditFiltersProps {
  filters: AuditLogFilters
  onChange: (key: keyof AuditLogFilters, value: any) => void
  onClear: () => void
}

export const AuditFilters = ({ filters, onChange, onClear }: AuditFiltersProps) => {
  const [localActorId, setLocalActorId] = useState(filters.actorId || "")

  // Debounce actorId change to prevent instant network refetches
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localActorId !== (filters.actorId || "")) {
        onChange("actorId", localActorId)
      }
    }, 400)

    return () => clearTimeout(handler)
  }, [localActorId, filters.actorId, onChange])

  // Keep local input in sync with external clears/params changes
  useEffect(() => {
    setLocalActorId(filters.actorId || "")
  }, [filters.actorId])

  const hasActiveFilters =
    !!filters.action ||
    !!filters.resourceType ||
    !!filters.actorId ||
    !!filters.dateRange ||
    !!filters.dateFrom ||
    !!filters.dateTo

  return (
    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Actor Search (ID / Email) */}
        <div className="space-y-1.5">
          <Label htmlFor="actorSearch" className="text-xs font-semibold text-muted-foreground">
            Search Actor
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="actorSearch"
              placeholder="Search User ID or Email..."
              value={localActorId}
              onChange={(e) => setLocalActorId(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Action Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Action</Label>
          <Select
            value={filters.action || "ALL"}
            onValueChange={(val) => onChange("action", val)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="LOGOUT">Logout</SelectItem>
              <SelectItem value="WORKFLOW_CREATED">Workflow Created</SelectItem>
              <SelectItem value="WORKFLOW_UPDATED">Workflow Updated</SelectItem>
              <SelectItem value="WORKFLOW_PUBLISHED">Workflow Published</SelectItem>
              <SelectItem value="WORKFLOW_EXECUTED">Workflow Executed</SelectItem>
              <SelectItem value="MEMBER_INVITED">Member Invited</SelectItem>
              <SelectItem value="MEMBER_REMOVED">Member Removed</SelectItem>
              <SelectItem value="API_KEY_CREATED">API Key Created</SelectItem>
              <SelectItem value="API_KEY_REVOKED">API Key Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resource Type Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Resource Type</Label>
          <Select
            value={filters.resourceType || "ALL"}
            onValueChange={(val) => onChange("resourceType", val)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Resources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Resource Types</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="WORKFLOW">Workflow</SelectItem>
              <SelectItem value="EXECUTION">Execution</SelectItem>
              <SelectItem value="API_KEY">API Key</SelectItem>
              <SelectItem value="ORGANIZATION">Organization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Dropdown */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Time Period</Label>
          <Select
            value={filters.dateRange || "ALL"}
            onValueChange={(val) => onChange("dateRange", val)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Custom Date Inputs Drawer/Section */}
      {filters.dateRange === "custom" && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 border border-border/80 bg-muted/20 rounded-xl animate-in fade-in-50 slide-in-from-top-2 duration-150">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="dateFrom" className="text-xs font-semibold text-muted-foreground">
              From Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom ? filters.dateFrom.split("T")[0] : ""}
                onChange={(e) =>
                  onChange(
                    "dateFrom",
                    e.target.value ? new Date(e.target.value).toISOString() : ""
                  )
                }
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="dateTo" className="text-xs font-semibold text-muted-foreground">
              To Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo ? filters.dateTo.split("T")[0] : ""}
                onChange={(e) =>
                  onChange(
                    "dateTo",
                    e.target.value ? new Date(e.target.value).toISOString() : ""
                  )
                }
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Clear Action Button if there are filters */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground text-xs font-semibold"
          >
            <FilterX className="h-3.5 w-3.5" />
            Clear Active Filters
          </Button>
        </div>
      )}
    </div>
  )
}
