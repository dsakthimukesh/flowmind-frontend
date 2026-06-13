import { WifiOff } from "lucide-react"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="bg-amber-500 text-amber-950 font-semibold px-4 py-2 text-center text-xs sm:text-sm flex items-center justify-center gap-2 select-none shrink-0 animate-in slide-in-from-top duration-200 sticky top-0 z-[100] shadow-md border-b border-amber-600/20">
      <WifiOff className="h-4 w-4 animate-bounce shrink-0" />
      <span>You are currently offline. Workflow modifications and key creations are temporarily disabled.</span>
    </div>
  )
}
