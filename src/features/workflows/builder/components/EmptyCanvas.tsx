import React from "react"
import { Sparkles, ArrowLeft } from "lucide-react"

export const EmptyCanvas = React.memo(() => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-background/60 backdrop-blur-md rounded-2xl border border-dashed border-border/80 shadow-md max-w-sm gap-3 animate-pulse">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Canvas is Empty</h3>
          <p className="text-xs text-muted-foreground leading-relaxed flex items-center justify-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Drag a node from the left panel to start building.
          </p>
        </div>
      </div>
    </div>
  )
})

EmptyCanvas.displayName = "EmptyCanvas"
