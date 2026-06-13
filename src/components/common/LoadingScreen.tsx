import { Loader2 } from "lucide-react"

export const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading FlowMind AI...</p>
    </div>
  )
}
