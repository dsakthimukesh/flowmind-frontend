import { useEffect } from "react"
import { useWorkflowBuilderStore } from "../store/workflowBuilderStore"

interface ShortcutProps {
  onSave: () => void
}

export const useKeyboardShortcuts = ({ onSave }: ShortcutProps) => {
  const {
    nodes,
    edges,
    copiedNode,
    undo,
    redo,
    copyNode,
    pasteNode,
    duplicateNode,
    onNodesChange,
    onEdgesChange,
  } = useWorkflowBuilderStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing node shortcuts if the user is currently typing in input/textarea forms
      const target = e.target as HTMLElement
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable

      const isCtrl = e.ctrlKey || e.metaKey
      const isShift = e.shiftKey

      // 1. Ctrl + S (Save Version)
      if (isCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault()
        onSave()
        return
      }

      // 2. Ctrl + Shift + Z or Ctrl + Y (Redo)
      if (isCtrl && ((isShift && e.key.toLowerCase() === "z") || e.key.toLowerCase() === "y")) {
        e.preventDefault()
        redo()
        return
      }

      // 3. Ctrl + Z (Undo)
      if (isCtrl && e.key.toLowerCase() === "z" && !isShift) {
        e.preventDefault()
        undo()
        return
      }

      // Bypasses other shortcuts (like deleting nodes or copy/paste) if typing in fields
      if (isTyping) return

      // 4. Delete / Backspace (Remove Selected Node)
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeNode = nodes.find((n) => n.selected)
        if (activeNode) {
          e.preventDefault()
          
          // Delete edges connected to this node first to prevent orphaned paths
          const connectedEdges = edges.filter(
            (edge) => edge.source === activeNode.id || edge.target === activeNode.id
          )
          if (connectedEdges.length > 0) {
            onEdgesChange(connectedEdges.map((edge) => ({ id: edge.id, type: "remove" })))
          }
          
          // Delete the node
          onNodesChange([{ id: activeNode.id, type: "remove" }])
        }
        return
      }

      // 5. Ctrl + C (Copy Selected Node)
      if (isCtrl && e.key.toLowerCase() === "c") {
        const activeNode = nodes.find((n) => n.selected)
        if (activeNode) {
          e.preventDefault()
          copyNode(activeNode)
        }
        return
      }

      // 6. Ctrl + V (Paste Node)
      if (isCtrl && e.key.toLowerCase() === "v") {
        if (copiedNode) {
          e.preventDefault()
          pasteNode()
        }
        return
      }

      // 7. Ctrl + D (Duplicate Selected Node)
      if (isCtrl && e.key.toLowerCase() === "d") {
        const activeNode = nodes.find((n) => n.selected)
        if (activeNode) {
          e.preventDefault()
          duplicateNode(activeNode.id)
        }
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    nodes,
    edges,
    copiedNode,
    onSave,
    undo,
    redo,
    copyNode,
    pasteNode,
    duplicateNode,
    onNodesChange,
    onEdgesChange,
  ])
}
