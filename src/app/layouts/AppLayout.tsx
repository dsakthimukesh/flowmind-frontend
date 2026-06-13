import { useEffect } from "react"
import { NavLink, Outlet, useNavigate } from "react-router"
import {
  LayoutDashboard,
  GitBranch,
  Activity,
  Database,
  Users,
  Key,
  FileText,
  Settings,
  Menu,
  Sun,
  Moon,
  LogOut,
  Building,
  ChevronDown,
  User,
} from "lucide-react"

import { useUiStore } from "@/stores/uiStore"
import { useAuthStore } from "@/stores/authStore"
import { useOrganizationStore } from "@/stores/organizationStore"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useSocketConnection } from "@/features/executions/realtime/hooks/useSocketConnection"
import { ConnectionStatus } from "@/features/executions/realtime/components/ConnectionStatus"
import { OfflineBanner } from "@/components/common/OfflineBanner"

export const AppLayout = () => {
  useSocketConnection()
  const navigate = useNavigate()
  const { sidebarOpen, toggleSidebar, theme, setTheme } = useUiStore()
  const { user, role, clearSession } = useAuthStore()
  const { currentOrganization, organizations, setCurrentOrganization } = useOrganizationStore()

  // Apply theme class to <html> tag for Tailwind v4
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "light") {
      root.classList.remove("dark")
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      if (systemTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }, [theme])

  const handleLogout = () => {
    clearSession()
    navigate("/auth/login")
  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Workflows", path: "/workflows", icon: GitBranch },
    { name: "Executions", path: "/executions", icon: Activity },
    { name: "Knowledge Bases", path: "/knowledge-bases", icon: Database },
    { name: "Team", path: "/team", icon: Users },
    { name: "API Keys", path: "/api-keys", icon: Key },
    ...(role === "OWNER" || role === "ADMIN"
      ? [{ name: "Audit Logs", path: "/audit-logs", icon: FileText }]
      : []),
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Brand logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-xl font-bold tracking-tight text-primary">FlowMind AI</span>
      </div>

      {/* Org selector */}
      <div className="p-4 border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              <span className="flex items-center gap-2 truncate">
                <Building className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{currentOrganization?.name || "Select Organization"}</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => setCurrentOrganization(org)}
                className="cursor-pointer"
              >
                {org.name}
              </DropdownMenuItem>
            ))}
            {organizations.length === 0 && (
              <DropdownMenuItem disabled>No organizations</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Theme toggle */}
      <div className="p-4 border-t border-border flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
          <span>Theme</span>
          <div className="flex gap-1 bg-muted p-0.5 rounded-md">
            <button
              onClick={() => setTheme("light")}
              aria-label="Light Theme"
              className={cn("p-1 rounded", theme === "light" && "bg-card text-foreground shadow-sm")}
            >
              <Sun className="h-3 w-3" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              aria-label="Dark Theme"
              className={cn("p-1 rounded", theme === "dark" && "bg-card text-foreground shadow-sm")}
            >
              <Moon className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className={cn("hidden md:block shrink-0 transition-all duration-300", sidebarOpen ? "w-64" : "w-0")}>
        <div className="w-64 h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <OfflineBanner />
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="flex md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
              {currentOrganization ? `Workspace: ${currentOrganization.name}` : ""}
            </span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <ConnectionStatus />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user ? `${user.firstName} ${user.lastName}` : "User Profile"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@flowmind.ai"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
