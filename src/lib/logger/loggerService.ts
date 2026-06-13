/* eslint-disable no-console */
type LogLevel = "info" | "warn" | "error"

class LoggerService {
  private isDev = import.meta.env.DEV

  private log(level: LogLevel, message: string, data?: unknown) {
    const timestamp = new Date().toISOString()
    const formattedMessage = `[FlowMind][${timestamp}][${level.toUpperCase()}]: ${message}`

    if (this.isDev) {
      switch (level) {
        case "info":
          console.info(formattedMessage, data ?? "")
          break
        case "warn":
          console.warn(formattedMessage, data ?? "")
          break
        case "error":
          console.error(formattedMessage, data ?? "")
          break
      }
    } else {
      // In production, we only print warn and errors to console (or forward to observability services like Sentry / Datadog)
      if (level === "error") {
        console.error(formattedMessage, data ?? "")
        // TODO: Sentry.captureException(data ?? new Error(message))
      } else if (level === "warn") {
        console.warn(formattedMessage, data ?? "")
        // TODO: Datadog.logWarning(message, data)
      }
    }
  }

  public info(message: string, data?: unknown) {
    this.log("info", message, data)
  }

  public warn(message: string, data?: unknown) {
    this.log("warn", message, data)
  }

  public error(message: string, data?: unknown) {
    this.log("error", message, data)
  }
}

export const logger = new LoggerService()
