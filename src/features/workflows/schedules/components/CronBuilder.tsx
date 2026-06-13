import React, { useState, useEffect } from "react"
import { isValidCron } from "cron-validator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info, AlertCircle } from "lucide-react"

interface CronBuilderProps {
  value: string
  onChange: (value: string) => void
}

const PRESETS = [
  { label: "Every Minute", value: "* * * * *", key: "minute" },
  { label: "Every Hour", value: "0 * * * *", key: "hour" },
  { label: "Every Day", value: "0 0 * * *", key: "day" },
  { label: "Every Week (Sunday)", value: "0 0 * * 0", key: "week" },
  { label: "Every Month (1st Day)", value: "0 0 1 * *", key: "month" },
  { label: "Custom Cron Expression", value: "custom", key: "custom" },
]

export const CronBuilder: React.FC<CronBuilderProps> = ({ value, onChange }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>("day")
  const [customExpression, setCustomExpression] = useState<string>("0 0 * * *")
  const [customError, setCustomError] = useState<string | null>(null)

  // Sync initial value on load
  useEffect(() => {
    const matched = PRESETS.find((p) => p.value === value)
    if (matched) {
      setSelectedPreset(matched.key)
    } else {
      setSelectedPreset("custom")
      setCustomExpression(value || "* * * * *")
    }
  }, [value])

  // Validate custom cron when it changes
  useEffect(() => {
    if (selectedPreset === "custom") {
      // Validate 5-field cron expression using cron-validator
      const valid = isValidCron(customExpression, { seconds: false, alias: true })
      if (!valid) {
        setCustomError("Invalid cron format. Exactly 5 space-separated fields are required.")
      } else {
        setCustomError(null)
      }
    } else {
      setCustomError(null)
    }
  }, [customExpression, selectedPreset])

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey)
    if (presetKey === "custom") {
      onChange(customExpression)
    } else {
      const preset = PRESETS.find((p) => p.key === presetKey)
      if (preset) {
        onChange(preset.value)
      }
    }
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomExpression(val)
    onChange(val)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cron-preset-select" className="text-xs font-bold text-muted-foreground">
          Schedule Frequency
        </Label>
        <Select value={selectedPreset} onValueChange={handlePresetChange}>
          <SelectTrigger id="cron-preset-select" className="h-9 text-sm rounded-lg bg-background">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border rounded-lg shadow-md">
            {PRESETS.map((p) => (
              <SelectItem key={p.key} value={p.key} className="text-sm cursor-pointer">
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPreset === "custom" ? (
        <div className="space-y-2">
          <Label htmlFor="cron-custom-input" className="text-xs font-bold text-muted-foreground flex items-center justify-between">
            <span>Custom Cron Expression</span>
            <span className="text-[10px] font-normal text-muted-foreground">Min Hour Dom Mon Dow</span>
          </Label>
          <Input
            id="cron-custom-input"
            type="text"
            value={customExpression}
            onChange={handleCustomChange}
            placeholder="e.g. */5 * * * *"
            className="h-9 text-sm rounded-lg"
          />
          {customError ? (
            <p className="text-xs text-destructive flex items-center gap-1.5 mt-1 font-semibold select-none">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{customError}</span>
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 select-none">
              <Info className="h-3 w-3 shrink-0" />
              <span>Standard 5-field cron format (e.g. <code>*/15 * * * *</code> for every 15 minutes).</span>
            </p>
          )}
        </div>
      ) : (
        <div className="bg-muted/40 border border-border p-3 rounded-lg flex items-center gap-2 select-none">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs text-muted-foreground">
            Cron Expression: <code className="bg-secondary/80 border text-foreground font-semibold px-1.5 py-0.5 rounded text-[10px] ml-1">{value}</code>
          </span>
        </div>
      )}
    </div>
  )
}
