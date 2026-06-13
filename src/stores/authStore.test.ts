import { describe, it, expect, beforeEach } from "vitest"
import { useAuthStore } from "./authStore"

describe("authStore", () => {
  beforeEach(() => {
    // Reset state before each test
    useAuthStore.getState().clearSession()
  })

  it("should initialize with null state", () => {
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.role).toBeNull()
    expect(state.isAuthenticated()).toBe(false)
  })

  it("should set session credentials correctly", () => {
    const mockUser = {
      id: "usr_123",
      email: "test@flowmind.ai",
      firstName: "Sakthi",
      lastName: "Mukesh",
      createdAt: "2026-06-13",
      updatedAt: "2026-06-13",
    }
    
    useAuthStore.getState().setSession("jwt_token_xyz", mockUser, "ADMIN", "org_789")
    
    const state = useAuthStore.getState()
    expect(state.token).toBe("jwt_token_xyz")
    expect(state.user).toEqual(mockUser)
    expect(state.role).toBe("ADMIN")
    expect(state.organizationId).toBe("org_789")
    expect(state.isAuthenticated()).toBe(true)
  })

  it("should clear session credentials correctly", () => {
    const mockUser = {
      id: "usr_123",
      email: "test@flowmind.ai",
      firstName: "Sakthi",
      lastName: "Mukesh",
      createdAt: "2026-06-13",
      updatedAt: "2026-06-13",
    }
    
    useAuthStore.getState().setSession("jwt_token_xyz", mockUser, "ADMIN", "org_789")
    useAuthStore.getState().clearSession()
    
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.role).toBeNull()
    expect(state.organizationId).toBeNull()
    expect(state.isAuthenticated()).toBe(false)
  })
})
