import * as React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useLibrary } from "@/context/LibraryContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X, LayoutDashboard, Users, Grid, CreditCard, Fingerprint, Bell, User, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useLibrary()
  const location = useLocation()
  const [currentUser, setCurrentUser] = React.useState<{ name: string; email: string } | null>(null)

  React.useEffect(() => {
    const userStr = localStorage.getItem("currentUser")
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr))
      } catch (e) {}
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")
    window.location.href = "/login"
  }

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Members", path: "/members", icon: Users },
    { label: "Seats", path: "/seats", icon: Grid },
    { label: "Finance", path: "/finance", icon: CreditCard },
    { label: "Attendance", path: "/attendance", icon: Fingerprint },
  ]

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col h-screen flex-1 min-w-0">
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-background">
            {/* Desktop View: Toggle Sidebar Button */}
            <div className="hidden md:block">
              <SidebarTrigger className="-ml-1" />
            </div>

            {/* Mobile View: Brand Identity Header, Notifications & User Logout */}
            <div className="flex md:hidden items-center justify-between w-full">
              <div className="flex items-center gap-2 select-none">
                <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold tracking-tight text-foreground">Ethics Library</span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Notification bell button */}
                <button className="relative p-1.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-full hover:bg-muted transition-colors border-0 bg-transparent">
                  <Bell className="size-4" />
                  <span className="absolute top-1.5 right-1.5 size-1.5 bg-primary rounded-full ring-1 ring-background animate-pulse" />
                </button>

                {/* Mobile User Profile & Logout Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer border border-border">
                      <User className="size-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-none">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs font-bold leading-none">{currentUser?.name || "Mani (Owner)"}</p>
                        <p className="text-[10px] leading-none text-muted-foreground">{currentUser?.email || "mani@gmail.com"}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs font-bold cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                      <LogOut className="size-3.5 mr-2" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-8 min-w-0 pb-20 md:pb-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around h-16 md:hidden px-4 shadow-[0_-5px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 h-full w-14 transition-colors relative cursor-pointer ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-5 shrink-0" />
                <span className="text-[9px] font-bold tracking-tight uppercase">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Premium Minimal Toast Notifications */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="alert"
              className={`p-3.5 border shadow-lg flex items-start justify-between pointer-events-auto cursor-pointer rounded-none animate-in slide-in-from-bottom-3 fade-in duration-200 ${
                toast.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-900"
                  : toast.type === "error"
                  ? "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground dark:border-destructive/30"
                  : toast.type === "warning"
                  ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-900"
                  : "bg-zinc-50 text-zinc-800 border-zinc-200 dark:bg-zinc-950/90 dark:text-zinc-300 dark:border-zinc-800"
              }`}
              onClick={() => removeToast(toast.id)}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                  {toast.type === "success"
                    ? "Success"
                    : toast.type === "error"
                    ? "Error"
                    : toast.type === "warning"
                    ? "Warning"
                    : "Info"}
                </span>
                <p className="text-xs font-semibold">{toast.message}</p>
              </div>
              <button 
                className="text-muted-foreground hover:text-foreground ml-3 shrink-0 p-0.5"
                onClick={(e) => {
                  e.stopPropagation()
                  removeToast(toast.id)
                }}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

