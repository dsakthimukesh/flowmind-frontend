import { describe, it, expect } from "vitest"
import { validateStartNode } from "../rules/start.rule"
import { type BuilderNode } from "../../types/builder.types"

describe("validateStartNode rule checks", () => {
  it("should return a global error when start node is missing", () => {
    const nodes: BuilderNode[] = [
      {
        id: "node_end",
        type: "END",
        data: { label: "End Node" },
        position: { x: 100, y: 100 },
      },
    ]

    const errors = validateStartNode(nodes)
    expect(errors.length).toBe(1)
    expect(errors[0].id).toBe("rule-start-missing")
    expect(errors[0].type).toBe("global")
    expect(errors[0].message).toBe("Workflow must contain exactly one Start node.")
  })

  it("should pass when exactly one start node is present", () => {
    const nodes: BuilderNode[] = [
      {
        id: "node_start",
        type: "START",
        data: { label: "Start Node" },
        position: { x: 0, y: 0 },
      },
      {
        id: "node_end",
        type: "END",
        data: { label: "End Node" },
        position: { x: 100, y: 100 },
      },
    ]

    const errors = validateStartNode(nodes)
    expect(errors.length).toBe(0)
  })

  it("should return node-specific errors when multiple start nodes are present", () => {
    const nodes: BuilderNode[] = [
      {
        id: "node_start_1",
        type: "START",
        data: { label: "Start 1" },
        position: { x: 0, y: 0 },
      },
      {
        id: "node_start_2",
        type: "START",
        data: { label: "Start 2" },
        position: { x: 50, y: 0 },
      },
    ]

    const errors = validateStartNode(nodes)
    expect(errors.length).toBe(2)
    expect(errors[0].type).toBe("node")
    expect(errors[0].nodeId).toBe("node_start_1")
    expect(errors[1].type).toBe("node")
    expect(errors[1].nodeId).toBe("node_start_2")
  })
})
