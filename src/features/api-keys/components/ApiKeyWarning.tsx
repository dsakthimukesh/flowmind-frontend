import React from "react"
import { ShieldAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const ApiKeyWarning = React.memo(() => {
  return (
    <Card className="border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 shadow-sm animate-in fade-in duration-300">
      <CardContent className="p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
            Security Warning
          </h4>
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed font-medium">
            API keys grant full access to your workspace. Store them securely, and never expose them publicly in frontend clients, public repositories, or unencrypted assets.
          </p>
        </div>
      </CardContent>
    </Card>
  )
})

ApiKeyWarning.displayName = "ApiKeyWarning"
