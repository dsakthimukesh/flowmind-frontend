import React from "react"
import { useReactFlow } from "reactflow"
import { AlertCircle } from "lucide-react"
import { type ValidationError } from "../types/validation.types"

interface ValidationErrorItemProps {
  error: ValidationError
}

export const ValidationErrorItem: React.FC<ValidationErrorItemProps> = ({ error }) => {
  const { setCenter, getNode, setNodes } = useReactFlow()

  const handleFocusNode = () => {
    if (error.type !== "node" || !error.nodeId) return

    const node = getNode(error.nodeId)
    if (node) {
      // Calculate center coordinates
      const width = node.width ?? 180
      const height = node.height ?? 80
      const x = node.position.x + width / 2
      const y = node.position.y + height / 2

      // Zoom and center onto node
      setCenter(x, y, { zoom: 1.2, duration: 400 })

      // Select the node visually
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === error.nodeId,
        }))
      )
    }
  }

  const isClickable = error.type === "node" && !!error.nodeId

  return (
    <div
      onClick={isClickable ? handleFocusNode : undefined}
      className={`flex items-start gap-2.5 p-3 rounded-lg border transition-all text-sm group ${
        isClickable
          ? "cursor-pointer hover:bg-destructive/10 border-destructive/20 bg-destructive/5 hover:border-destructive/30"
          : "border-destructive/20 bg-destructive/5"
      }`}
    >
      <AlertCircle className="h-4.5 w-4.5 text-destructive shrink-0 mt-0.5" />
      <div className="flex-1 space-y-0.5">
        <p className="font-medium text-destructive leading-tight group-hover:underline">
          {error.message}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground select-none">
          <span>Rule:</span>
          <span className="font-semibold bg-secondary/50 border px-1.5 py-0.25 rounded text-[10px]">
            {error.rule}
          </span>
          {isClickable && (
            <span className="text-[10px] text-destructive/70 font-medium">
              • Click to locate
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
