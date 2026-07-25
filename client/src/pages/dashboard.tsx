import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useLibrary } from "@/context/LibraryContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  UserCheck,
  AlertTriangle,
  ArrowRightLeft,
  Plus,
  CreditCard,
  RefreshCw,
  Printer,
  FileText,
  AlertCircle,
  TrendingUp,
  BookOpen,
} from "lucide-react"

export default function DashboardPage() {
  const navigate = useNavigate()
  const { members, seats, attendanceLogs, transactions, expenses } = useLibrary()

  // Get current date string formatted like "Jul 24, 2026"
  const todayStr = React.useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
    return new Date().toLocaleDateString("en-US", options)
  }, [])

  // Dynamic calculations
  const totalMembersCount = members.length
  const activeMembersCount = members.filter((m) => m.status === "Active").length
  const occupiedSeatsCount = seats.filter((s) => s.status === "Occupied").length
  const availableSeatsCount = seats.filter((s) => s.status === "Available").length
  const maintenanceSeatsCount = seats.filter((s) => s.status === "Maintenance").length
  const reservedSeatsCount = seats.filter((s) => s.status === "Reserved").length

  // Parse amount helper (e.g., "₹1,500" -> 1500)
  const parseAmount = (amtStr: string) => {
    return parseInt(amtStr.replace(/[₹,]/g, ""), 10) || 0
  }

  // Calculate today's revenue (transactions created today)
  const todayRevenue = React.useMemo(() => {
    return transactions
      .filter((tx) => tx.date.includes(todayStr))
      .reduce((sum, tx) => sum + parseAmount(tx.amount), 0)
  }, [transactions, todayStr])

  // Calculate monthly revenue
  const monthlyRevenue = React.useMemo(() => {
    return transactions.reduce((sum, tx) => sum + parseAmount(tx.amount), 0)
  }, [transactions])

  // Calculate total expenses
  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((sum, exp) => sum + parseAmount(exp.amount), 0)
  }, [expenses])

  // Today's Live Counters
  const todayCheckIns = attendanceLogs.filter((log) => log.date === todayStr).length
  const todayCheckOuts = attendanceLogs.filter((log) => log.date === todayStr && log.status === "Checked Out").length
  const insideCount = attendanceLogs.filter((log) => log.status === "Inside").length
  const newAdmissions = members.filter((m) => m.joined.includes(todayStr)).length

  // Alerts data
  const alerts = [
    { id: 1, type: "warning", message: "12 Memberships expiring in 7 days", details: "Send auto-reminders via WhatsApp" },
    { id: 2, type: "danger", message: `${members.filter(m => m.status === 'Inactive').length} Members with inactive status`, details: "Review cards and send renewals" },
    { id: 3, type: "info", message: `${seats.filter(s => s.status === 'Maintenance').length} Seats currently under maintenance`, details: "Pending electrician resolution" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ethics Library Admin</h1>
          <p className="text-muted-foreground font-medium">
            Real-time management for desks, memberships, and collections.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-none font-semibold cursor-pointer" onClick={() => navigate("/attendance")}>
            Today's Log
          </Button>
          <Button size="sm" className="rounded-none font-semibold cursor-pointer" onClick={() => navigate("/seats")}>
            System Status: Live
          </Button>
        </div>
      </div>

      {/* 1. KPI Cards Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Key Performance Indicators</h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {/* Members */}
          <Card className="rounded-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-3 md:p-4 pb-1.5 md:pb-2 flex flex-row items-center justify-between">
              <span className="text-[10px] md:text-xs font-semibold text-muted-foreground">Total Members</span>
              <Users className="size-3.5 md:size-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <div className="text-lg md:text-2xl font-bold">{totalMembersCount}</div>
              <p className="text-[9px] md:text-[10px] text-emerald-500 mt-0.5 font-bold">
                {newAdmissions > 0 ? `+${newAdmissions} new` : "Active database"}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-3 md:p-4 pb-1.5 md:pb-2 flex flex-row items-center justify-between">
              <span className="text-[10px] md:text-xs font-semibold text-muted-foreground">Active Members</span>
              <UserCheck className="size-3.5 md:size-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <div className="text-lg md:text-2xl font-bold">{activeMembersCount}</div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground mt-0.5 font-medium">
                {totalMembersCount > 0 ? `${Math.round((activeMembersCount / totalMembersCount) * 100)}% active` : "0% active"}
              </p>
            </CardContent>
          </Card>

          {/* Seats */}
          <Card className="rounded-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-3 md:p-4 pb-1.5 md:pb-2 flex flex-row items-center justify-between">
              <span className="text-[10px] md:text-xs font-semibold text-muted-foreground">Occupied Seats</span>
              <div className="size-1.5 md:size-2 rounded-full bg-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <div className="text-lg md:text-2xl font-bold">{occupiedSeatsCount} / {seats.length}</div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground mt-0.5 font-medium">{availableSeatsCount} Available</p>
            </CardContent>
          </Card>

          {/* Expiring / Fines */}
          <Card className="rounded-none border-amber-500/20 bg-amber-500/5 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-3 md:p-4 pb-1.5 md:pb-2 flex flex-row items-center justify-between">
              <span className="text-[10px] md:text-xs font-semibold text-amber-600 dark:text-amber-400">Expiring Soon</span>
              <AlertTriangle className="size-3.5 md:size-4 text-amber-500" />
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <div className="text-lg md:text-2xl font-bold text-amber-600 dark:text-amber-400">12</div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground mt-0.5 font-medium">7 Days</p>
            </CardContent>
          </Card>

          {/* Financials */}
          <Card className="rounded-none border-primary/20 bg-primary/5 shadow-sm hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
            <CardHeader className="p-3 md:p-4 pb-1.5 md:pb-2 flex flex-row items-center justify-between">
              <span className="text-[10px] md:text-xs font-semibold text-primary">Today's Revenue</span>
              <TrendingUp className="size-3.5 md:size-4 text-primary" />
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <div className="text-lg md:text-2xl font-bold text-primary">₹{todayRevenue.toLocaleString()}</div>
              <p className="text-[9px] md:text-[10px] text-muted-foreground mt-0.5 font-medium">
                M: ₹{(monthlyRevenue / 1000).toFixed(1)}k • E: ₹{(totalExpenses / 1000).toFixed(1)}k
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. Quick Actions Panel */}
      <Card className="rounded-none border-border shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Control Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-0 grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          <Button variant="outline" className="rounded-none justify-start gap-1.5 h-9 px-2.5 text-[11px] md:text-xs font-semibold cursor-pointer" onClick={() => navigate("/members")}>
            <Plus className="size-3.5 text-primary shrink-0" /> Add Member
          </Button>
          <Button variant="outline" className="rounded-none justify-start gap-1.5 h-9 px-2.5 text-[11px] md:text-xs font-semibold cursor-pointer" onClick={() => navigate("/seats")}>
            <BookOpen className="size-3.5 text-primary shrink-0" /> Assign Seat
          </Button>
          <Button variant="outline" className="rounded-none justify-start gap-1.5 h-9 px-2.5 text-[11px] md:text-xs font-semibold cursor-pointer" onClick={() => navigate("/finance")}>
            <CreditCard className="size-3.5 text-primary shrink-0" /> Collect Fee
          </Button>
          <Button variant="outline" className="rounded-none justify-start gap-1.5 h-9 px-2.5 text-[11px] md:text-xs font-semibold cursor-pointer" onClick={() => navigate("/membership")}>
            <RefreshCw className="size-3.5 text-primary shrink-0" /> Renew Plan
          </Button>
          <Button variant="outline" className="rounded-none justify-start gap-1.5 h-9 px-2.5 text-[11px] md:text-xs font-semibold cursor-pointer" onClick={() => navigate("/seats")}>
            <ArrowRightLeft className="size-3.5 text-primary shrink-0" /> Move Desk
          </Button>
          <Button variant="outline" className="rounded-none justify-start gap-1.5 h-9 px-2.5 text-[11px] md:text-xs font-semibold cursor-pointer" onClick={() => navigate("/finance")}>
            <Printer className="size-3.5 text-primary shrink-0" /> Print Receipt
          </Button>
          <Button variant="outline" className="rounded-none justify-start gap-1.5 h-9 px-2.5 text-[11px] md:text-xs font-semibold cursor-pointer" onClick={() => navigate("/reports")}>
            <FileText className="size-3.5 text-primary shrink-0" /> View Reports
          </Button>
        </CardContent>
      </Card>

      {/* 3. Today's Overview & Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Overview */}
        <Card className="rounded-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Today's Live Counters</CardTitle>
            <CardDescription className="font-medium">Direct logs for today's operational transactions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border-l-2 border-primary pl-3 py-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Currently Inside</span>
                <div className="text-xl font-bold">{insideCount} Students</div>
              </div>
              <div className="border-l-2 border-zinc-400 pl-3 py-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Today's Activity</span>
                <div className="text-xl font-bold">{todayCheckIns} in / {todayCheckOuts} out</div>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3 py-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">New Admissions</span>
                <div className="text-xl font-bold">{newAdmissions} Members</div>
              </div>
              <div className="border-l-2 border-primary pl-3 py-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Fee Collected Today</span>
                <div className="text-xl font-bold">₹{todayRevenue.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="rounded-none border-destructive/20 bg-destructive/5 flex flex-col justify-between shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-destructive flex items-center gap-2 font-bold">
              <AlertCircle className="size-4" /> System Alerts
            </CardTitle>
            <CardDescription className="text-destructive/80 font-medium">Pending tasks needing immediate action.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex gap-2 items-start text-xs border-b border-destructive/10 pb-3 last:border-0 last:pb-0">
                <div className="size-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{alert.message}</p>
                  <p className="text-muted-foreground font-medium">{alert.details}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. Seat Status details */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Seat Allocation Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-bold">Total Capacity</span>
              <span className="font-bold">{seats.length} Desks</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-bold">Occupied Desks</span>
              <span className="font-bold text-primary">{occupiedSeatsCount} Desks</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-bold">Available Desks</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{availableSeatsCount} Desks</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-bold">Reserved Seats</span>
              <span className="font-bold text-blue-500">{reservedSeatsCount} Desks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-bold">Maintenance Blocked</span>
              <span className="font-bold text-red-500">{maintenanceSeatsCount} Desks</span>
            </div>
          </CardContent>
        </Card>

        {/* 5. Demographic Breakdown */}
        <Card className="rounded-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Demographic Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-bold">Male Students</span>
              <span className="font-bold">{Math.round(totalMembersCount * 0.6)} Members</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-bold">Female Students</span>
              <span className="font-bold">{totalMembersCount - Math.round(totalMembersCount * 0.6)} Members</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-bold">Active Subscriptions</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeMembersCount} Members</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-bold">Inactive/Expired Cards</span>
              <span className="font-bold text-red-500">{totalMembersCount - activeMembersCount} Members</span>
            </div>
          </CardContent>
        </Card>

        {/* 6. Staff Attendance Status */}
        <Card className="rounded-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Librarian Staff Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-bold">Total Staff Members</span>
              <span className="font-bold">4 Staff</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-bold">Staff Present Today</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">3 Present</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-bold">Active Gatekeeper Terminal</span>
              <span className="font-bold text-primary">Terminal-1 Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
