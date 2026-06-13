import { io, type Socket } from "socket.io-client"
import { env } from "@/app/config/env"
import { useAuthStore } from "@/stores/authStore"
import { logger } from "@/lib/logger/loggerService"

class SocketClient {
  private socket: Socket | null = null
  // Map event names to a map of original callbacks -> wrapper callbacks to ensure off cleanups actually succeed
  private listenersMap = new Map<string, Map<(...args: any[]) => void, (...args: any[]) => void>>()

  public getSocket(): Socket | null {
    return this.socket
  }

  public connect(): void {
    if (this.socket?.connected) return

    const token = useAuthStore.getState().token

    this.socket = io(env.VITE_SOCKET_URL, {
      autoConnect: false,
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    })

    // Reconnect safety: Refresh auth token prior to connection retries
    this.socket.on("reconnect_attempt", () => {
      const refreshedToken = useAuthStore.getState().token
      if (this.socket) {
        this.socket.auth = { token: refreshedToken }
      }
      logger.info("Socket reconnecting with updated auth token")
    })

    // Hearbeat logs and connection checks
    this.socket.on("connect", () => {
      logger.info("Socket connected successfully")
    })

    this.socket.on("disconnect", (reason) => {
      logger.warn(`Socket disconnected. Reason: ${reason}`)
    })

    this.socket.on("connect_error", (error) => {
      logger.error("Socket connection error:", error)
    })

    this.socket.connect()
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.listenersMap.clear()
      logger.info("Socket disconnected and listeners map cleared")
    }
  }

  public emit(event: string, ...args: unknown[]): void {
    if (!this.socket) {
      this.connect()
    }
    this.socket?.emit(event, ...args)
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    if (!this.socket) {
      this.connect()
    }

    if (!this.listenersMap.has(event)) {
      this.listenersMap.set(event, new Map())
    }

    const eventListeners = this.listenersMap.get(event)!

    // Prevent duplicate subscriptions of the exact same callback
    if (eventListeners.has(callback)) {
      logger.warn(`Attempted duplicate listener registration for event: ${event}`)
      return
    }

    const wrapper = (data: unknown) => {
      if (Array.isArray(data)) {
        callback(...data)
      } else {
        callback(data)
      }
    }

    eventListeners.set(callback, wrapper)
    this.socket?.on(event, wrapper)
  }

  public off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return

    if (callback) {
      const eventListeners = this.listenersMap.get(event)
      if (eventListeners) {
        const wrapper = eventListeners.get(callback)
        if (wrapper) {
          this.socket.off(event, wrapper)
          eventListeners.delete(callback)
          logger.info(`Removed event listener wrapper for: ${event}`)
        }
      }
    } else {
      this.socket.off(event)
      this.listenersMap.delete(event)
      logger.info(`Removed all event listeners for: ${event}`)
    }
  }
}

export const socketClient = new SocketClient()
