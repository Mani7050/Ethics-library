import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, IndianRupee, Users, Armchair, TrendingUp } from "lucide-react"

export default function ReportsPage() {
  const reportsList = [
    { title: "Attendance Report (Student Entry/Exit Times)", icon: Calendar, size: "1.4 MB", type: "PDF" },
    { title: "Fee Collection Report (Receipts & Invoices)", icon: IndianRupee, size: "3.2 MB", type: "CSV" },
    { title: "Pending Fee Report (Defaulters & Reminders)", icon: FileText, size: "450 KB", type: "PDF" },
    { title: "Membership Report (Active, Expired & Renewals)", icon: Users, size: "2.1 MB", type: "CSV" },
    { title: "Seat Occupancy Report (Desk Utilization Rates)", icon: Armchair, size: "850 KB", type: "PDF" },
    { title: "Income & Expense Report (Utilities, Rent & Salary)", icon: IndianRupee, size: "1.8 MB", type: "Excel" },
    { title: "Daily/Monthly Summary Report (Consolidated Stats)", icon: TrendingUp, size: "5.4 MB", type: "Excel" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Audit & Library Reports</h1>
        <p className="text-muted-foreground">
          Download real-time and historical data reports for audit analysis.
        </p>
      </div>

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-base">Available System Reports</CardTitle>
          <CardDescription>Click download to save the report file to your downloads directory.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportsList.map((rep) => (
            <div key={rep.title} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <rep.icon className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{rep.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Format: <span className="font-semibold text-primary">{rep.type}</span> • Size: {rep.size} • Generated: Just now
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-none gap-1 font-medium cursor-pointer">
                <Download className="size-3.5" /> Download
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
