import { useEffect } from "react"
import { socketClient } from "@/lib/socket/socketClient"
import { useAuthStore } from "@/stores/authStore"
import { useOrganizationStore } from "@/stores/organizationStore"
import { useRealtimeStore } from "../store/realtimeStore"

export const useSocketConnection = () => {
  const token = useAuthStore((state) => state.token)
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization)
  const { setConnected, setDisconnected, setReconnecting } = useRealtimeStore()

  useEffect(() => {
    if (!token) {
      socketClient.disconnect()
      setDisconnected()
      return
    }

    // Connect socket
    socketClient.connect()

    const socket = socketClient.getSocket()
    if (!socket) return

    // Sync initial state
    setConnected(socket.connected)

    const onConnect = () => {
      setConnected(true)
    }

    const onDisconnect = () => {
      setConnected(false)
    }

    const onConnectError = () => {
      setConnected(false)
      setReconnecting(true)
    }

    const onReconnectAttempt = () => {
      setReconnecting(true)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("connect_error", onConnectError)
    socket.on("reconnect_attempt", onReconnectAttempt)
    socket.on("reconnect", onConnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("connect_error", onConnectError)
      socket.off("reconnect_attempt", onReconnectAttempt)
      socket.off("reconnect", onConnect)
    }
  }, [token, setConnected, setDisconnected, setReconnecting])

  // Reconnect when organization changes
  useEffect(() => {
    if (token && currentOrganization) {
      socketClient.disconnect()
      socketClient.connect()
    }
  }, [currentOrganization?.id, token])
}
