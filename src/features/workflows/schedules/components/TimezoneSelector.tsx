import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TimezoneSelectorProps {
  value: string
  onChange: (value: string) => void
}

// Key timezones requested by the user
const PRIORITY_TIMEZONES = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "Europe/London",
  "Asia/Singapore",
]

// Extract full list of IANA timezones from the browser environment
const getIanaTimezones = (): string[] => {
  if (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function") {
    try {
      const allZones = Intl.supportedValuesOf("timeZone")
      // Filter out duplicates and priority ones to list them below
      return allZones.filter((tz) => !PRIORITY_TIMEZONES.includes(tz))
    } catch (err) {
      console.error("Intl timezone listing failed", err)
    }
  }
  // Standard fallback zones if Intl is unavailable
  return [
    "America/Los_Angeles",
    "America/Chicago",
    "Asia/Tokyo",
    "Europe/Paris",
    "Asia/Dubai",
    "Australia/Sydney",
  ]
}

const OTHER_TIMEZONES = getIanaTimezones()

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="timezone-select" className="text-xs font-bold text-muted-foreground">
        Execution Timezone
      </Label>
      <Select value={value || "UTC"} onValueChange={onChange}>
        <SelectTrigger id="timezone-select" className="h-9 text-sm rounded-lg bg-background">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border rounded-lg shadow-md max-h-60 overflow-y-auto">
          {/* Priority timezone list */}
          {PRIORITY_TIMEZONES.map((tz) => (
            <SelectItem key={tz} value={tz} className="text-sm font-semibold cursor-pointer">
              {tz} (Recommended)
            </SelectItem>
          ))}
          
          <div className="h-px bg-border my-1.5" />
          
          {/* Complete IANA alphabetical list */}
          {OTHER_TIMEZONES.map((tz) => (
            <SelectItem key={tz} value={tz} className="text-sm cursor-pointer">
              {tz}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
