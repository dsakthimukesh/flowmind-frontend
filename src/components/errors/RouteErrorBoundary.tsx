import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Uncaught route error:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 border border-destructive/20 bg-destructive/5 dark:bg-destructive/10 rounded-2xl max-w-lg mx-auto space-y-4 my-8 text-center animate-in fade-in-50 duration-150">
          <div className="mx-auto w-10 h-10 bg-destructive/10 text-destructive flex items-center justify-center rounded-full">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Sub-page render crash</h3>
            <p className="text-xs text-muted-foreground font-semibold">
              An error occurred while rendering this feature. Other features are still accessible.
            </p>
          </div>
          {this.state.error && (
            <div className="p-2.5 bg-card rounded-lg border border-border text-left font-mono text-xs overflow-auto max-h-[100px] text-muted-foreground select-text mx-auto max-w-sm">
              {this.state.error.message || this.state.error.toString()}
            </div>
          )}
          <Button onClick={this.handleReset} variant="outline" size="xs" className="h-8 gap-1 border-destructive/20 text-destructive hover:bg-destructive/10">
            <RefreshCw className="h-3 w-3" />
            Try Resetting Route
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
