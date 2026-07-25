import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Plus, Mail, Phone } from "lucide-react"

export default function StaffPage() {
  const staff = [
    { name: "Mani (Owner)", email: "admin@ethicslibrary.com", phone: "+91 98765 43210", role: "Super Admin / Owner", shift: "08:00 AM - 10:00 PM", status: "Active" },
    { name: "Rajesh Kumar", email: "rajesh@ethicslibrary.com", phone: "+91 91234 56789", role: "Librarian In-charge", shift: "08:00 AM - 04:00 PM", status: "Active" },
    { name: "Vikram Singh", email: "vikram@ethicslibrary.com", phone: "+91 98877 66554", role: "Assistant Staff", shift: "02:00 PM - 10:00 PM", status: "Active" },
    { name: "Amit Sharma", email: "amit@ethicslibrary.com", phone: "+91 99988 77766", role: "Security Gatekeeper", shift: "08:00 AM - 08:00 PM", status: "On Leave" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Librarian Staff Overview</h1>
          <p className="text-muted-foreground">
            Manage shifts, attendance, and access credentials for library operators.
          </p>
        </div>
        <Button className="rounded-none gap-1 font-semibold cursor-pointer">
          <Plus className="size-4" /> Add Staff
        </Button>
      </div>

      {/* Staff Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-none">
          <CardHeader className="p-4 pb-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Registered Staff</span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">4 Members</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-emerald-500/20 bg-emerald-50/5">
          <CardHeader className="p-4 pb-1">
            <span className="text-[10px] uppercase font-bold text-emerald-500">Present Today</span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-500">3 Staff Online</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-primary/20 bg-primary/5">
          <CardHeader className="p-4 pb-1">
            <span className="text-[10px] uppercase font-bold text-primary">Active Shifts</span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-primary">Shift A & B</div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <div className="grid gap-4 md:grid-cols-2">
        {staff.map((s) => (
          <Card key={s.email} className="rounded-none border hover:shadow-md transition-shadow">
            <CardHeader className="bg-muted/20 pb-4 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-primary">{s.role}</span>
                  <CardTitle className="text-base">{s.name}</CardTitle>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  s.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-red-100 text-red-700 dark:bg-red-900/30"
                }`}>
                  {s.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Clock className="size-3.5" /> Shift Hours:</span>
                <span className="font-semibold">{s.shift}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground flex items-center gap-1"><Mail className="size-3.5" /> Email ID:</span>
                <span className="font-medium">{s.email}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground flex items-center gap-1"><Phone className="size-3.5" /> Phone Number:</span>
                <span className="font-medium">{s.phone}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
