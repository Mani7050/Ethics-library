import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Grid,
  Fingerprint,
  CreditCard,
  DollarSign,
  FileText,
  Briefcase,
  Settings,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const platformItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    url: "/members",
    icon: Users,
  },
  {
    title: "Seat Status",
    url: "/seats",
    icon: Grid,
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: Fingerprint,
  },
  {
    title: "Membership",
    url: "/membership",
    icon: CreditCard,
  },
  {
    title: "Finance",
    url: "/finance",
    icon: DollarSign,
  },
]

const systemItems = [
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Staff Overview",
    url: "/staff",
    icon: Briefcase,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex h-16 justify-center border-b border-sidebar-border px-4 py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              onClick={() => navigate("/dashboard")}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Ethics Library</span>
                <span className="text-[10px] text-muted-foreground">v0.1.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platformItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground data-[active=true]:font-semibold transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground data-[active=true]:font-semibold transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="w-full cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={handleLogout}
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                <User className="size-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none text-left">
                <span className="text-xs font-medium">{currentUser?.name || "Mani (Owner)"}</span>
                <span className="text-[10px] text-muted-foreground">{currentUser?.email || "mani@gmail.com"} (Logout)</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
