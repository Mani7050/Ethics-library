import * as React from "react"
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
import { Search, Plus, MoreVertical, ShieldCheck, Award, Gem } from "lucide-react"

export default function MembershipPage() {
  const { subscriptions, assignMembership, members } = useLibrary()

  const [plans] = React.useState([
    { name: "General Library Access", price: "₹800", duration: "Monthly", type: "Standard", desc: "Access to common hall reading tables, high-speed Wi-Fi, and standard seating.", icon: Award, color: "border-zinc-200 dark:border-zinc-800" },
    { name: "Premium Reading Desk", price: "₹1,500", duration: "Monthly", type: "Reserved", desc: "Assigned reserved reading desk, private study lamp, locker access, and personal socket.", icon: Gem, color: "border-primary/50 ring-1 ring-primary/20 bg-primary/5" },
    { name: "VIP Quiet Cabin", price: "₹3,000", duration: "Monthly", type: "Private", desc: "Personal private partition cabin, noise cancellation chamber, ergonomic office chair.", icon: ShieldCheck, color: "border-zinc-200 dark:border-zinc-800" },
  ])

  // New Subscription assignment states
  const [memberEmail, setMemberEmail] = React.useState("")
  const [selectedPlan, setSelectedPlan] = React.useState("Premium Reading Desk")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // Local search query
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleAssignMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!memberEmail) return

    const success = await assignMembership(memberEmail, selectedPlan)
    if (success) {
      setMemberEmail("")
      setIsSheetOpen(false)
    }
  }

  // Filter subscriptions
  const filteredSubscriptions = React.useMemo(() => {
    return subscriptions.filter(
      (sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [subscriptions, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Membership</h1>
        <p className="text-muted-foreground font-medium">
          Configure reader subscription tiers, edit access plans, and monitor live member subscriptions.
        </p>
      </div>

      {/* Plans list visualization */}
      <div className="grid gap-6 md:grid-cols-3 pt-2">
        {plans.map((p, idx) => {
          const Icon = p.icon
          return (
            <div key={idx} className={`border p-6 flex flex-col justify-between space-y-6 rounded-none shadow-sm ${p.color}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    {p.type}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{p.price}</span>
                    <span className="text-xs text-muted-foreground font-medium">/ {p.duration}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {p.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Control bar - Plain/Borderless */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between py-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search subscription..." 
            className="pl-9 rounded-none font-medium" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 items-center">
          {/* Assign Plan Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-none gap-1 h-9 cursor-pointer font-bold">
                <Plus className="size-4" /> Assign Subscription
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:!max-w-xl p-6 bg-background">
              <SheetHeader className="pb-6">
                <SheetTitle className="font-bold text-xl">Assign Member Subscription</SheetTitle>
                <SheetDescription className="font-medium">
                  Allocate a library seat membership plan to a reader.
                </SheetDescription>
              </SheetHeader>
              
              <form onSubmit={handleAssignMembershipSubmit} className="flex flex-col flex-1 justify-between">
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
                      {members.filter(m => m.status === 'Active').map((m) => (
                        <option key={m.email} value={m.email}>{m.name} ({m.email})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Select Membership Plan</label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="w-full text-xs p-2.5 bg-background border border-input rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {plans.map((p, idx) => (
                        <option key={idx} value={p.name}>{p.name} ({p.price})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <SheetFooter className="pt-4 border-t mt-auto">
                  <SheetClose asChild>
                    <Button type="button" variant="outline" className="rounded-none w-full cursor-pointer font-bold">Cancel</Button>
                  </SheetClose>
                  <Button type="submit" disabled={!memberEmail} className="rounded-none w-full cursor-pointer font-bold">Assign Plan</Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Subscription Table list - Beautiful Borderless layout */}
      <div className="overflow-x-auto border-t border-b border-border shadow-sm">
        <table className="w-full text-xs text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-muted/10 font-bold text-zinc-800 dark:text-zinc-200">
              <th className="p-4">Member Name</th>
              <th className="p-4">Assigned Subscription</th>
              <th className="p-4">Paid Fees</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((sub) => (
              <tr key={sub.id} className="border-b border-border hover:bg-muted/10 transition-colors last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${sub.color}`}>
                      {sub.initial}
                    </div>
                    <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{sub.name}</span>
                  </div>
                </td>
                <td className="p-4 font-semibold text-primary">{sub.plan}</td>
                <td className="p-4 font-bold text-zinc-800 dark:text-zinc-200">{sub.price}</td>
                <td className="p-4 text-muted-foreground font-medium">{sub.start}</td>
                <td className="p-4 text-muted-foreground font-medium">{sub.end}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* CSS Toggle switch representation of status */}
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked={sub.status === "Active"} className="sr-only peer" />
                      <div className="w-8 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>

                    {/* Status Badge */}
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon-sm" className="rounded-none text-muted-foreground cursor-pointer">
                    <MoreVertical className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {filteredSubscriptions.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground font-semibold">
                  No active subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
