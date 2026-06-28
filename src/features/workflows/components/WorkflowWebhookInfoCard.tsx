import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { env } from "@/app/config/env"
import { Check, Copy, Link as LinkIcon, Key, Terminal } from "lucide-react"

interface WorkflowWebhookInfoCardProps {
  workflowId: string
}

export const WorkflowWebhookInfoCard = React.memo(({ workflowId }: WorkflowWebhookInfoCardProps) => {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedPayload, setCopiedPayload] = useState(false)

  const triggerUrl = `${env.VITE_API_BASE_URL}/workflows/${workflowId}/execute`
  
  const samplePayload = JSON.stringify(
    {
      senderEmail: "student@example.edu",
      emailBody: "What is the deadline for admissions application?"
    },
    null,
    2
  )

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(triggerUrl)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL", err)
    }
  }

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(samplePayload)
      setCopiedPayload(true)
      setTimeout(() => setCopiedPayload(false), 2000)
    } catch (err) {
      console.error("Failed to copy payload", err)
    }
  }

  return (
    <Card className="bg-card border-border shadow-sm">
      <div>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            API Webhook Trigger
          </CardTitle>
          <CardDescription className="pt-1">
            Trigger executions programmatically from external systems (Zapier, Microsoft Power Automate, Postman).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 text-sm md:grid-cols-2 lg:grid-cols-3">
          {/* Webhook URL Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Webhook URL (POST)
            </label>
            <div className="flex items-start gap-2 bg-muted p-2 rounded border border-border">
              <span className="font-mono text-[11px] text-muted-foreground break-all select-all select-text flex-1">
                {triggerUrl}
              </span>
              <button
                onClick={handleCopyUrl}
                className="hover:bg-muted-foreground/10 p-1.5 rounded transition"
                title="Copy Webhook URL"
              >
                {copiedUrl ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Authentication Header Section */}
          <div className="space-y-1.5 md:border-l md:border-border md:pl-6">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Key className="h-3 w-3" /> Authorization Header
            </label>
            <div className="bg-muted p-2.5 rounded font-mono text-[11px] text-muted-foreground border border-border">
              Authorization: Bearer &lt;YOUR_API_KEY&gt;
            </div>
            <p className="text-[10px] text-muted-foreground">
              Generate credentials in the <a href="/api-keys" className="text-primary hover:underline font-bold">API Keys</a> settings tab.
            </p>
          </div>

          {/* Sample JSON Payload Section */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1 lg:border-l lg:border-border lg:pl-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="h-3 w-3" /> Sample Request Body
              </label>
              <button
                onClick={handleCopyPayload}
                className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1"
              >
                {copiedPayload ? "Copied!" : "Copy Payload"}
              </button>
            </div>
            <pre className="bg-muted p-2.5 rounded font-mono text-[10px] text-muted-foreground overflow-x-auto border border-border max-h-36">
              {samplePayload}
            </pre>
          </div>
        </CardContent>
      </div>
    </Card>
  )
})

WorkflowWebhookInfoCard.displayName = "WorkflowWebhookInfoCard"
