import React, { useState, useEffect, useRef } from "react"
import { Search, X, ChevronDown, ChevronUp } from "lucide-react"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"
import { useReactFlow } from "reactflow"

export const NodeSearch: React.FC = () => {
  const { nodes, setSearchQuery, searchQuery, setNodes } = useWorkflowBuilderStore()
  const { setCenter } = useReactFlow()
  const inputRef = useRef<HTMLInputElement>(null)
  
  const [matchIndex, setMatchIndex] = useState<number>(0)

  // Listen for Ctrl+F to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const query = searchQuery.toLowerCase().trim()
  const matches = query
    ? nodes.filter((node) => {
        const label = (node.data?.label || "").toLowerCase()
        const desc = (node.data?.description || "").toLowerCase()
        const type = (node.type || "").toLowerCase()
        return label.includes(query) || desc.includes(query) || type.includes(query)
      })
    : []

  // Reset match index when query changes
  useEffect(() => {
    setMatchIndex(0)
  }, [searchQuery])

  // Center on active match when match index changes
  useEffect(() => {
    if (matches.length > 0 && matches[matchIndex]) {
      const match = matches[matchIndex]
      
      // Calculate coordinates to center (fallback dimensions 220x90)
      const width = match.width || 220
      const height = match.height || 90
      const x = match.position.x + width / 2
      const y = match.position.y + height / 2

      setCenter(x, y, { zoom: 1.1, duration: 300 })
      
      // Focus/Select the matching node visually
      setNodes(
        nodes.map((n) => ({
          ...n,
          selected: n.id === match.id,
        }))
      )
    }
  }, [matchIndex, matches.length])

  const handleNext = () => {
    if (matches.length === 0) return
    setMatchIndex((prev) => (prev + 1) % matches.length)
  }

  const handlePrev = () => {
    if (matches.length === 0) return
    setMatchIndex((prev) => (prev - 1 + matches.length) % matches.length)
  }

  const handleClear = () => {
    setSearchQuery("")
    inputRef.current?.blur()
  }

  return (
    <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-card border border-border p-1.5 rounded-xl shadow-lg backdrop-blur-sm select-none">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          id="canvas-node-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find nodes... (Ctrl+F)"
          className="pl-8 pr-7 py-1 h-8 w-48 text-xs bg-muted/50 rounded-lg border border-border/80 focus:border-primary focus:bg-card focus:outline-hidden transition-all text-foreground"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-2 text-muted-foreground hover:text-foreground hover:bg-muted p-0.5 rounded-md"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {query && matches.length > 0 && (
        <div className="flex items-center gap-1.5 border-l border-border pl-2 pr-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground text-[10px]">
            {matchIndex + 1}/{matches.length}
          </span>
          <div className="flex items-center">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-muted rounded-md hover:text-foreground text-muted-foreground transition-colors"
              title="Previous Match"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-muted rounded-md hover:text-foreground text-muted-foreground transition-colors"
              title="Next Match"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {query && matches.length === 0 && (
        <div className="border-l border-border pl-2 pr-1 text-[10px] text-destructive font-semibold">
          No matches
        </div>
      )}
    </div>
  )
}
