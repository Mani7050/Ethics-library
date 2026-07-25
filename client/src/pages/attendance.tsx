import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLibrary } from "@/context/LibraryContext"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Search, MoreVertical, LogIn, LogOut } from "lucide-react"

export default function AttendancePage() {
  const { 
    attendanceLogs, 
    checkInMember, 
    checkOutMember, 
    members, 
    seats 
  } = useLibrary()

  // New checkin form states
  const [memberEmail, setMemberEmail] = React.useState("")
  const [selectedSeatId, setSelectedSeatId] = React.useState<number | "">("")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // Local Search & Filter states
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"All" | "Inside" | "Checked Out">("All")

  // Filter members who are active and not currently inside the library
  const checkInEligibleMembers = React.useMemo(() => {
    return members.filter(
      (m) => m.status === "Active" && !attendanceLogs.some((l) => l.email === m.email && l.status === "Inside")
    )
  }, [members, attendanceLogs])

  // Filter seats that are available
  const availableSeats = React.useMemo(() => {
    return seats.filter((s) => s.status === "Available")
  }, [seats])

  // Sync selected seat on open or change
  React.useEffect(() => {
    if (availableSeats.length > 0 && !selectedSeatId) {
      setSelectedSeatId(availableSeats[0].id)
    }
  }, [availableSeats, selectedSeatId])

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!memberEmail || !selectedSeatId) return

    const success = await checkInMember(memberEmail, Number(selectedSeatId))
    if (success) {
      setMemberEmail("")
      setSelectedSeatId("")
      setIsSheetOpen(false)
    }
  }

  // Calculate live count statistics
  const insideCount = attendanceLogs.filter((log) => log.status === "Inside").length
  const totalCheckIns = attendanceLogs.length

  // Filter & Search log logic
  const filteredLogs = React.useMemo(() => {
    return attendanceLogs.filter((log) => {
      const matchesSearch = 
        log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.seat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "All" || log.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [attendanceLogs, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground font-medium">
          Monitor real-time reader check-ins, entry-exit timestamps, and active seat sessions.
        </p>
      </div>

      {/* Attendance KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-none border border-border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inside Library Now</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              {insideCount} Members
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Currently occupying active seats.</p>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Check-Ins Today</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalCheckIns} Entries</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Accumulated logins since midnight.</p>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-border shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Average Stay duration</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">6.8 Hours</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Average daily reading desk occupancy.</p>
          </CardContent>
        </Card>
      </div>

      {/* Control bar - Plain/Borderless */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between py-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search attendance log..." 
            className="pl-9 rounded-none font-medium" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs h-9 px-3 bg-background border border-border rounded-none focus:outline-none cursor-pointer text-muted-foreground font-semibold"
          >
            <option value="All">All Logs</option>
            <option value="Inside">Inside Now</option>
            <option value="Checked Out">Checked Out</option>
          </select>

          {/* Add Attendance / Manual Check-In Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-none gap-1 h-9 cursor-pointer font-bold">
                <LogIn className="size-4" /> Manual Entry
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:!max-w-xl p-6 bg-background">
              <SheetHeader className="pb-6">
                <SheetTitle className="font-bold text-xl">Manual Attendance Entrance</SheetTitle>
                <SheetDescription className="font-medium">
                  Manually register a reader check-in when RFID/Biometric scan is bypassed.
                </SheetDescription>
              </SheetHeader>
              
              <form onSubmit={handleCheckInSubmit} className="flex flex-col flex-1 justify-between">
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Choose Active Member</label>
                    <select
                      required
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-background border border-input rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">-- Select Member --</option>
                      {checkInEligibleMembers.map((m) => (
                        <option key={m.email} value={m.email}>{m.name} ({m.email})</option>
                      ))}
                    </select>
                    {checkInEligibleMembers.length === 0 && (
                      <p className="text-[10px] text-destructive font-semibold mt-1">All active members are already checked-in!</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Assign Seat/Desk</label>
                    <select
                      required
                      value={selectedSeatId}
                      onChange={(e) => setSelectedSeatId(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-background border border-input rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">-- Choose Available Desk --</option>
                      {availableSeats.map((s) => (
                        <option key={s.id} value={s.id}>Desk #{s.id}</option>
                      ))}
                    </select>
                    {availableSeats.length === 0 && (
                      <p className="text-[10px] text-destructive font-semibold mt-1">No available seats left!</p>
                    )}
                  </div>
                </div>

                <SheetFooter className="pt-4 border-t mt-auto flex flex-row items-center justify-end gap-2.5">
                  <SheetClose asChild>
                    <Button type="button" variant="outline" size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">Cancel</Button>
                  </SheetClose>
                  <Button type="submit" disabled={!memberEmail || !selectedSeatId} size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">
                    Register Check-In
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Attendance List Table */}
      <div className="overflow-x-auto border-t border-b border-border">
        <table className="w-full text-xs text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-muted/10 font-bold text-zinc-800 dark:text-zinc-200">
              <th className="p-4">Member Name</th>
              <th className="p-4">Assigned Seat</th>
              <th className="p-4">Date</th>
              <th className="p-4">Check-In Time</th>
              <th className="p-4">Check-Out Time</th>
              <th className="p-4">Active Hours</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-border hover:bg-muted/10 transition-colors last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${log.color}`}>
                      {log.initial}
                    </div>
                    <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{log.name}</span>
                  </div>
                </td>
                <td className="p-4 font-semibold text-primary">{log.seat}</td>
                <td className="p-4 text-muted-foreground font-medium">{log.date}</td>
                <td className="p-4 text-emerald-600 font-bold">{log.checkIn}</td>
                <td className="p-4">
                  {log.status === "Inside" ? (
                    <span className="text-muted-foreground font-medium">--</span>
                  ) : (
                    <span className="text-amber-600 font-bold">{log.checkOut}</span>
                  )}
                </td>
                <td className="p-4 font-bold">{log.hours}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* CSS Toggle switch representation of status */}
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={log.status === "Inside"} 
                        onChange={() => {
                          if (log.status === "Inside") checkOutMember(log.id)
                        }}
                        disabled={log.status !== "Inside"}
                        className="sr-only peer" 
                      />
                      <div className="w-8 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>

                    {/* Status Badge */}
                    {log.status === "Inside" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Inside
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300 px-2 py-0.5 text-[10px] font-bold">
                        <span className="size-1.5 rounded-full bg-zinc-400" />
                        Logged Out
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {log.status === "Inside" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => checkOutMember(log.id)}
                        className="rounded-none h-7 px-2.5 text-[10px] font-bold cursor-pointer hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/20"
                      >
                        <LogOut className="size-3 mr-1" /> Log Out
                      </Button>
                    )}
                    <Button variant="ghost" size="icon-sm" className="rounded-none text-muted-foreground cursor-pointer">
                      <MoreVertical className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground font-semibold">
                  No attendance logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
