import React from "react"
import {
  Play,
  Square,
  Terminal,
  MessageSquare,
  GitFork,
  Globe,
  Clock,
  Database,
  Binary,
  FileText,
} from "lucide-react"

interface PaletteItem {
  type: string
  label: string
  description: string
  icon: React.ReactNode
  colorClass: string
}

const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: "START",
    label: "Start",
    description: "Initiates workflow runs.",
    icon: <Play className="h-4 w-4" />,
    colorClass: "border-emerald-500/20 text-emerald-500 bg-emerald-500/5",
  },
  {
    type: "END",
    label: "End",
    description: "Terminates workflow runs.",
    icon: <Square className="h-4 w-4" />,
    colorClass: "border-destructive/20 text-destructive bg-destructive/5",
  },
  {
    type: "PROMPT",
    label: "Prompt",
    description: "Executes LLM queries.",
    icon: <Terminal className="h-4 w-4" />,
    colorClass: "border-blue-500/20 text-blue-500 bg-blue-500/5",
  },
  {
    type: "CHAT",
    label: "Chat Agent",
    description: "Conversational agent.",
    icon: <MessageSquare className="h-4 w-4" />,
    colorClass: "border-violet-500/20 text-violet-500 bg-violet-500/5",
  },
  {
    type: "CONDITION",
    label: "Condition",
    description: "TRUE / FALSE branching logic.",
    icon: <GitFork className="h-4 w-4" />,
    colorClass: "border-amber-500/20 text-amber-500 bg-amber-500/5",
  },
  {
    type: "HTTP_REQUEST",
    label: "HTTP Request",
    description: "Calls external webhooks.",
    icon: <Globe className="h-4 w-4" />,
    colorClass: "border-cyan-500/20 text-cyan-500 bg-cyan-500/5",
  },
  {
    type: "DELAY",
    label: "Delay",
    description: "Pauses workflows for timers.",
    icon: <Clock className="h-4 w-4" />,
    colorClass: "border-orange-500/20 text-orange-500 bg-orange-500/5",
  },
  {
    type: "RAG_QUERY",
    label: "RAG Query",
    description: "Queries knowledge base.",
    icon: <Database className="h-4 w-4" />,
    colorClass: "border-indigo-500/20 text-indigo-500 bg-indigo-500/5",
  },
  {
    type: "TRANSFORM",
    label: "Transform",
    description: "Formats payload variables.",
    icon: <Binary className="h-4 w-4" />,
    colorClass: "border-pink-500/20 text-pink-500 bg-pink-500/5",
  },
  {
    type: "SUMMARIZE",
    label: "Summarize",
    description: "Condenses body input.",
    icon: <FileText className="h-4 w-4" />,
    colorClass: "border-teal-500/20 text-teal-500 bg-teal-500/5",
  },
]

export const NodePalette = React.memo(() => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <aside className="w-64 border-r border-border bg-card/50 p-4 space-y-4 select-none overflow-y-auto flex flex-col h-full">
      <div className="space-y-1">
        <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Node Palette</h2>
        <p className="text-xs text-muted-foreground">
          Drag and drop blocks to form automation pipelines.
        </p>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {PALETTE_ITEMS.map((item) => (
          <div
            key={item.type}
            id={`palette-item-${item.type}`}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            className={`flex items-start gap-3 p-3 border rounded-xl cursor-grab active:cursor-grabbing hover:shadow-sm transition-all duration-200 bg-card/90 ${item.colorClass}`}
          >
            <div className="p-1.5 rounded-lg bg-background flex items-center justify-center shadow-sm">
              {item.icon}
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-foreground">{item.label}</h3>
              <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
})

NodePalette.displayName = "NodePalette"
