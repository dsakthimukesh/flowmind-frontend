import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"

export const InvitePage = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 text-center md:text-left">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">You've been invited</h2>
        <p className="text-sm text-muted-foreground">
          You have been invited to join a FlowMind AI workspace. Click below to accept the invitation and set up your account.
        </p>
      </div>

      <div className="space-y-4">
        <Button className="w-full" onClick={() => navigate("/auth/register")}>
          Accept Invitation
        </Button>
        
        <Button className="w-full" variant="outline" onClick={() => navigate("/auth/login")}>
          Log in with existing account
        </Button>
      </div>
    </div>
  )
}
