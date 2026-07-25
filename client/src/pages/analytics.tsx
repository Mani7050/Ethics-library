import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { TrendingUp, Calendar, Activity, CreditCard } from "lucide-react"

export default function AnalyticsPage() {
  // Chart 1: Member Registration Trend
  const registrationData = [
    { month: "Jan", members: 45 },
    { month: "Feb", members: 60 },
    { month: "Mar", members: 85 },
    { month: "Apr", members: 110 },
    { month: "May", members: 160 },
    { month: "Jun", members: 210 },
    { month: "Jul", members: 245 },
  ]

  // Chart 2: Daily Attendance
  const attendanceData = [
    { day: "Mon", count: 72 },
    { day: "Tue", count: 85 },
    { day: "Wed", count: 94 },
    { day: "Thu", count: 88 },
    { day: "Fri", count: 80 },
    { day: "Sat", count: 98 },
    { day: "Sun", count: 50 },
  ]

  // Chart 3: Monthly Revenue
  const revenueData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 58000 },
    { month: "Mar", revenue: 72000 },
    { month: "Apr", revenue: 98000 },
    { month: "May", revenue: 120000 },
    { month: "Jun", revenue: 145000 },
  ]

  // Chart 4: Membership Plan Distribution (Monthly / Quarterly / Half-Yearly / Yearly)
  const planData = [
    { name: "Monthly", value: 120 },
    { name: "Quarterly", value: 65 },
    { name: "Half-Yearly", value: 38 },
    { name: "Yearly", value: 22 },
  ]

  const COLORS = ["#facc15", "#e4e4e7", "#a1a1aa", "#52525b"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Finance</h1>
        <p className="text-muted-foreground">
          Detailed metrics of membership registration trends, attendance logs, and fee collections.
        </p>
      </div>

      {/* Finance Summary */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Finance Summary</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card className="rounded-none">
            <CardHeader className="p-4 pb-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Today's Collection</span>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold text-primary">₹14,200</div>
            </CardContent>
          </Card>

          <Card className="rounded-none">
            <CardHeader className="p-4 pb-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Weekly Collection</span>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold">₹42,800</div>
            </CardContent>
          </Card>

          <Card className="rounded-none">
            <CardHeader className="p-4 pb-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Collection</span>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold">₹1,45,000</div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-red-500/20 bg-red-50/5">
            <CardHeader className="p-4 pb-1">
              <span className="text-[10px] uppercase font-bold text-red-500">Pending Dues</span>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold text-red-500">₹12,400</div>
            </CardContent>
          </Card>

          <Card className="rounded-none">
            <CardHeader className="p-4 pb-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Expenses (Rent/Bills)</span>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold">₹35,000</div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-emerald-500/20 bg-emerald-50/5">
            <CardHeader className="p-4 pb-1">
              <span className="text-[10px] uppercase font-bold text-emerald-500">Net Income</span>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-lg font-bold text-emerald-500">₹1,10,000</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart 1: Registration Trend */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" /> Member Registration Trend
            </CardTitle>
            <CardDescription>Overall student growth pattern over current year.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationData}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="#facc15" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Daily Attendance */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="size-4 text-primary" /> Daily Seat Attendance
            </CardTitle>
            <CardDescription>Number of check-ins per weekday.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#facc15" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Monthly Revenue */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="size-4 text-primary" /> Monthly Revenue Trend
            </CardTitle>
            <CardDescription>Subscription collections details (₹).</CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#18181b" dark-fill="#e4e4e7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Membership Plan Distribution */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="size-4 text-primary" /> Membership Plan Distribution
            </CardTitle>
            <CardDescription>Comparison of plan cycles chosen by students.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 text-xs font-semibold pr-8">
              {planData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="size-3" style={{ backgroundColor: COLORS[index] }} />
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
