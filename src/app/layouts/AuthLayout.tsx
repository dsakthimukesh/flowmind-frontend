import { Outlet } from "react-router"
import { Card } from "@/components/ui/card"

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden">
          <div className="grid p-6 md:grid-cols-2 gap-8 items-center min-h-[500px]">
            {/* Visual Branding Section */}
            <div className="hidden md:flex flex-col justify-between h-full bg-primary p-8 text-primary-foreground rounded-lg">
              <div className="space-y-2">
                <span className="text-xl font-bold tracking-tight">FlowMind AI</span>
                <p className="text-sm text-primary-foreground/80">
                  Automate your workflows with AI power. Connect tools, build pipelines, and orchestrate executions with ease.
                </p>
              </div>
              <span className="text-xs text-primary-foreground/60">
                &copy; {new Date().getFullYear()} FlowMind AI, Inc.
              </span>
            </div>
            
            {/* Auth Forms Area */}
            <div className="flex flex-col gap-6 justify-center">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <span className="text-xl font-bold tracking-tight md:hidden">FlowMind AI</span>
              </div>
              <Outlet />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
