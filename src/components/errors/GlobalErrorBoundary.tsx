import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Uncaught global error:", error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 shadow-lg text-center space-y-6 animate-in fade-in-50 duration-200">
            <div className="mx-auto w-12 h-12 bg-destructive/10 text-destructive flex items-center justify-center rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold">Something went wrong</h1>
              <p className="text-sm text-muted-foreground font-semibold">
                An unexpected application error occurred. We apologize for the inconvenience.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-muted rounded-lg border border-border text-left font-mono text-xs overflow-auto max-h-[140px] text-muted-foreground select-text">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={this.handleReload} className="w-full gap-2">
                <RefreshCw className="h-4 w-4" />
                Reload Application
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = "/"
                }}
                className="w-full text-xs text-muted-foreground"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
