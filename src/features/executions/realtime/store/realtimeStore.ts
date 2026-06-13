import { create } from "zustand"

interface RealtimeState {
  connected: boolean
  lastConnectedAt: string | null
  reconnecting: boolean
  activeExecutions: Record<string, string> // Map of executionId -> status

  setConnected: (connected: boolean) => void
  setDisconnected: () => void
  setReconnecting: (reconnecting: boolean) => void
  updateExecution: (id: string, status: string) => void
  clearActiveExecutions: () => void
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  connected: false,
  lastConnectedAt: null,
  reconnecting: false,
  activeExecutions: {},

  setConnected: (connected) =>
    set((state) => ({
      connected,
      reconnecting: connected ? false : state.reconnecting,
      lastConnectedAt: connected ? new Date().toISOString() : state.lastConnectedAt,
    })),

  setDisconnected: () =>
    set({
      connected: false,
      reconnecting: false,
    }),

  setReconnecting: (reconnecting) =>
    set({
      reconnecting,
    }),

  updateExecution: (id, status) =>
    set((state) => {
      const updated = { ...state.activeExecutions }
      if (status === "SUCCESS" || status === "FAILED") {
        delete updated[id] // remove completed ones from active
      } else {
        updated[id] = status
      }
      return { activeExecutions: updated }
    }),

  clearActiveExecutions: () => set({ activeExecutions: {} }),
}))
