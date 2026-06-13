import React from "react"
import { Copy, Download, ShieldAlert, Check } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type ApiKeyCreatedResponse } from "../types/apiKey.types"

interface ApiKeyCreatedDialogProps {
  data: ApiKeyCreatedResponse | null
  open: boolean
  onClose: () => void
}

export const ApiKeyCreatedDialog = React.memo(({ data, open, onClose }: ApiKeyCreatedDialogProps) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (!data) return
    navigator.clipboard.writeText(data.key)
    setCopied(true)
    toast.success("API Key copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!data) return
    const fileContent = [
      `FlowMind AI API Key\n`,
      `---------------------\n`,
      `Name: ${data.name}\n`,
      `Secret Key: ${data.key}\n`,
      `Created At: ${new Date().toLocaleString()}\n\n`,
      `WARNING: Keep this key secure. It will not be shown again.\n`,
    ].join("")

    const element = document.createElement("a")
    const file = new Blob([fileContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `flowmind-api-key-${data.name.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("API Key downloaded successfully")
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            API Key Generated
          </DialogTitle>
        </DialogHeader>

        {data && (
          <div className="space-y-4 py-3">
            {/* Warning Message block */}
            <div className="p-3 bg-red-500/10 text-red-800 dark:text-red-400 border border-red-500/20 text-xs font-semibold rounded-lg flex items-start gap-2 leading-relaxed">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Please copy or download this API key now. It is shown only once and cannot be retrieved again after this dialog is closed.
              </span>
            </div>

            {/* Secret key displays input row */}
            <div className="flex gap-2 items-center">
              <Input
                readOnly
                value={data.key}
                className="font-mono text-sm bg-muted text-foreground border-border select-all"
              />
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Download and copy triggers */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload} className="w-full gap-1.5 h-9 rounded-lg">
                <Download className="h-4 w-4" />
                Download Key (.txt)
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button onClick={onClose} className="w-full sm:w-auto">
            I've copied it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

ApiKeyCreatedDialog.displayName = "ApiKeyCreatedDialog"
