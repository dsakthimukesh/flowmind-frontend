import { describe, it, expect } from "vitest"
import { createWorkflowSchema } from "../schemas/createWorkflowSchema"

// Mock react query hooks behavior
describe("useWorkflows schema & hooks checks", () => {
  it("should validate valid workflow values successfully", () => {
    const valid = {
      name: "Staging Pipeline",
      description: "Trigger webhooks on staging.",
    }
    const result = createWorkflowSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("should fail validation if workflow name is empty", () => {
    const invalid = {
      name: "",
      description: "Trigger webhooks.",
    }
    const result = createWorkflowSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required")
    }
  })

  it("should fail validation if name exceeds 100 characters", () => {
    const invalid = {
      name: "a".repeat(101),
      description: "Trigger webhooks.",
    }
    const result = createWorkflowSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be less than 100 characters")
    }
  })
})
