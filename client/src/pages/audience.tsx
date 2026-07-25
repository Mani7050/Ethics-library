import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, Filter, Mail, Book } from "lucide-react"

export default function AudiencePage() {
  const members = [
    { name: "Mani (Owner)", email: "mani@ethicslibrary.com", phone: "+91 98765 43210", plan: "VIP Cabin - Desk A4", status: "Active", book: "Clean Code (Robert C. Martin)", since: "July 2026" },
    { name: "Rajesh Kumar", email: "rajesh@ethicslibrary.com", phone: "+91 91234 56789", plan: "Premium Reading Desk", status: "Active", book: "Cracking the Coding Interview", since: "May 2026" },
    { name: "Sarah Jenkins", email: "sarah@gmail.com", phone: "+1 555-0199", plan: "General Library Access", status: "Overdue", book: "Design Patterns (Gang of Four)", since: "Jan 2026" },
    { name: "Amit Verma", email: "amit.verma@yahoo.com", phone: "+91 98877 66554", plan: "Premium Reading Desk", status: "Expired", book: "None", since: "March 2026" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Student & Reader Profiles</h1>
        <p className="text-muted-foreground">
          Manage member details, check active library card statuses, and issue log files.
        </p>
      </div>

      {/* Control bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between bg-muted/20 p-4 border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students by name, card ID..." className="pl-9 rounded-none" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none gap-1">
            <Filter className="size-4" /> Filter Status
          </Button>
          <Button className="rounded-none gap-1">
            <UserPlus className="size-4" /> Add Reader
          </Button>
        </div>
      </div>

      {/* Members Directory List */}
      <div className="grid gap-4 md:grid-cols-2">
        {members.map((member) => (
          <Card key={member.email} className="overflow-hidden border border-border rounded-none hover:shadow-md transition-shadow">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Mail className="size-3" /> {member.email}
                  </CardDescription>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  member.status === "Active"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : member.status === "Overdue"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {member.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Book className="size-3.5" /> Book Borrowed:</span>
                <span className="font-semibold">{member.book}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Desk/Cabin Assignment:</span>
                <span className="font-medium text-primary">{member.plan}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Phone number:</span>
                <span className="font-medium">{member.phone}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Registered Since:</span>
                <span className="font-medium">{member.since}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
