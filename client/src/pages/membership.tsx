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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, LayoutGrid, List, ChevronDown, Award, Gem, ShieldCheck, Eye, RefreshCw, Trash2 } from "lucide-react"

export default function MembershipPage() {
  const { subscriptions, assignMembership, toggleSubscriptionStatus, deleteSubscription, members, plans, createPlan, deletePlan } = useLibrary()

  const getIconComponent = (plan: any) => {
    if (plan?.iconName === "Gem" || (plan?.name && plan.name.includes("Premium"))) return Gem
    if (plan?.iconName === "ShieldCheck" || (plan?.name && plan.name.includes("VIP"))) return ShieldCheck
    return Award
  }

  // Create Plan sheet states
  const [isCreatePlanOpen, setIsCreatePlanOpen] = React.useState(false)
  const [newPlanName, setNewPlanName] = React.useState("")
  const [newPlanPrice, setNewPlanPrice] = React.useState("")
  const [newPlanDuration, setNewPlanDuration] = React.useState("Monthly")
  const [newPlanType, setNewPlanType] = React.useState("Standard")
  const [newPlanDesc, setNewPlanDesc] = React.useState("")

  const handleCreatePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlanName || !newPlanPrice) return

    const success = await createPlan({
      name: newPlanName,
      price: newPlanPrice,
      duration: newPlanDuration,
      type: newPlanType,
      desc: newPlanDesc || "Standard library subscription access.",
    })

    if (success) {
      setNewPlanName("")
      setNewPlanPrice("")
      setNewPlanDesc("")
      setIsCreatePlanOpen(false)
    }
  }

  // New Subscription assignment states
  const [memberEmail, setMemberEmail] = React.useState("")
  const [selectedPlan, setSelectedPlan] = React.useState("Premium Reading Desk")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // View & Filter states
  const [activeTab, setActiveTab] = React.useState<"subscriptions" | "plans">("subscriptions")
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"All" | "Active" | "Expired">("All")
  const [expandedEmails, setExpandedEmails] = React.useState<Record<string, boolean>>({})
  const [viewingSub, setViewingSub] = React.useState<any | null>(null)

  const handleDeletePlan = async (planIdOrName: string) => {
    await deletePlan(planIdOrName)
  }

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
    const term = (searchTerm || "").toLowerCase()
    return (subscriptions || []).filter((sub) => {
      if (!sub) return false
      const matchesSearch =
        (sub.name || "").toLowerCase().includes(term) ||
        (sub.plan || "").toLowerCase().includes(term) ||
        (sub.email || "").toLowerCase().includes(term)

      const matchesStatus = statusFilter === "All" || sub.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [subscriptions, searchTerm, statusFilter])

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Membership</h1>
        <p className="text-muted-foreground font-medium">
          Configure reader subscription tiers, edit access plans, and monitor live member subscriptions.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-4 py-2 border-b-2 cursor-pointer transition-colors ${
            activeTab === "subscriptions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Active Subscriptions ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 border-b-2 cursor-pointer transition-colors ${
            activeTab === "plans"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Configured Tiers & Plans ({plans.length})
        </button>
      </div>

      {activeTab === "plans" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <h2 className="text-lg font-bold">Membership Plans & Tiers</h2>
              <p className="text-xs text-muted-foreground font-medium">Manage all configured subscription plans available for readers.</p>
            </div>
            <Button onClick={() => setIsCreatePlanOpen(true)} className="rounded-none gap-1 h-9 font-bold text-xs cursor-pointer">
              <Award className="size-4" /> Create New Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => {
              const IconComp = getIconComponent(plan)
              return (
                <div 
                  key={idx} 
                  className={`border bg-card p-6 flex flex-col justify-between space-y-4 rounded-none shadow-sm relative text-left ${plan.color || 'border-border'}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-muted text-muted-foreground">
                        {plan.type || "Standard"}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon-sm" 
                        onClick={() => handleDeletePlan(plan.name)}
                        className="size-7 text-muted-foreground hover:text-red-600 rounded-none cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-1">
                      <IconComp className="size-5 text-primary" />
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-primary">{plan.price}</span>
                      <span className="text-xs text-muted-foreground font-medium">/ {plan.duration || "Monthly"}</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex gap-2">
                    <Button 
                      onClick={() => {
                        setSelectedPlan(plan.name)
                        setActiveTab("subscriptions")
                        setIsSheetOpen(true)
                      }}
                      className="flex-1 rounded-none font-bold text-xs gap-1 cursor-pointer"
                    >
                      <Plus className="size-3.5" /> Assign to Member
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleDeletePlan(plan.name)}
                      className="rounded-none font-bold text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900 cursor-pointer"
                      title="Delete Plan"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <>
      {/* Control bar - Identical to /members */}
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
          {/* View Toggle */}
          <div className="flex border border-border rounded-none overflow-hidden h-9 bg-background">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              className="h-full px-3 rounded-none border-0 cursor-pointer"
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              className="h-full px-3 rounded-none border-0 cursor-pointer"
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>

          {/* Status Filter select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs h-9 px-3 bg-background border border-border rounded-none focus:outline-none cursor-pointer text-muted-foreground font-semibold"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>

          {/* Create Plan Sheet */}
          <Sheet open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-none gap-1 h-9 cursor-pointer font-bold">
                <Award className="size-4" /> Create Plan
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:!max-w-xl p-6 bg-background">
              <SheetHeader className="pb-6">
                <SheetTitle className="font-bold text-xl">Create Membership Plan</SheetTitle>
                <SheetDescription className="font-medium text-xs">
                  Define a new pricing tier and access plan for readers.
                </SheetDescription>
              </SheetHeader>
              
              <form onSubmit={handleCreatePlanSubmit} className="flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Plan Title</label>
                    <Input 
                      required 
                      placeholder="e.g. Night Study Pass" 
                      value={newPlanName}
                      onChange={(e) => setNewPlanName(e.target.value)}
                      className="rounded-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Monthly Fee (₹)</label>
                      <Input 
                        required 
                        type="number" 
                        placeholder="1200" 
                        value={newPlanPrice}
                        onChange={(e) => setNewPlanPrice(e.target.value)}
                        className="rounded-none text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Billing Duration</label>
                      <select
                        value={newPlanDuration}
                        onChange={(e) => setNewPlanDuration(e.target.value)}
                        className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none focus:ring-1 focus:ring-primary h-9"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="7 Days">7 Days Pass</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Seating Type</label>
                    <select
                      value={newPlanType}
                      onChange={(e) => setNewPlanType(e.target.value)}
                      className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none focus:ring-1 focus:ring-primary h-9"
                    >
                      <option value="Standard">Standard Hall Access</option>
                      <option value="Reserved">Reserved Dedicated Desk</option>
                      <option value="Private">Private Cabin / AC</option>
                      <option value="Custom">Custom Access</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Description & Features</label>
                    <textarea 
                      rows={3}
                      placeholder="e.g. Access to quiet room, high-speed Wi-Fi, personal locker."
                      value={newPlanDesc}
                      onChange={(e) => setNewPlanDesc(e.target.value)}
                      className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <SheetFooter className="pt-4 border-t mt-auto flex flex-row items-center justify-end gap-2.5">
                  <SheetClose asChild>
                    <Button type="button" variant="outline" size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">Cancel</Button>
                  </SheetClose>
                  <Button type="submit" size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">Create Plan</Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>

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

                <SheetFooter className="pt-4 border-t mt-auto flex flex-row items-center justify-end gap-2.5">
                  <SheetClose asChild>
                    <Button type="button" variant="outline" size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">Cancel</Button>
                  </SheetClose>
                  <Button type="submit" disabled={!memberEmail} size="sm" className="rounded-none cursor-pointer font-bold px-4 text-xs">Assign Plan</Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {viewMode === "table" ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto overflow-y-visible w-full max-w-full border-t border-b border-border">
            <table className="w-full text-xs text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-muted/10 font-bold text-zinc-800 dark:text-zinc-200">
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Assigned Subscription</th>
                  <th className="p-4">Paid Fees</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 w-[100px] text-right">Actions</th>
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
                      {/* CSS Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={sub.status === "Active"} 
                          onChange={() => toggleSubscriptionStatus(sub.id)}
                          className="sr-only peer" 
                        />
                        <div className="w-8 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="rounded-none text-muted-foreground cursor-pointer">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-none">
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer" onClick={() => setViewingSub(sub)}>
                            <Eye className="size-3.5 mr-2 text-muted-foreground" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer text-primary" onClick={() => {
                            setMemberEmail(sub.email)
                            setSelectedPlan(sub.plan)
                            setIsSheetOpen(true)
                          }}>
                            <RefreshCw className="size-3.5 mr-2" /> Renew Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20" onClick={() => deleteSubscription(sub.id)}>
                            <Trash2 className="size-3.5 mr-2" /> Delete Subscription
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
          <div className="h-8" />

          {/* Mobile Collapsible Cards View */}
          <div className="block md:hidden space-y-3">
            {filteredSubscriptions.map((sub) => {
              const isExpanded = !!expandedEmails[sub.email || String(sub.id)]
              const key = sub.email || String(sub.id)
              return (
                <div key={sub.id} className="border border-border bg-card p-4 rounded-none space-y-3 shadow-sm hover:shadow-md transition-shadow">
                  {/* Card Header */}
                  <div 
                    className="flex items-center justify-between cursor-pointer select-none" 
                    onClick={() => setExpandedEmails(prev => ({ ...prev, [key]: !prev[key] }))}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center font-bold text-xs ${sub.color}`}>
                        {sub.initial}
                      </div>
                      <div className="space-y-0.5 leading-tight text-left">
                        <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{sub.name}</h3>
                        <p className="text-[11px] text-primary font-semibold">{sub.plan}</p>
                      </div>
                    </div>
                    <div className="text-muted-foreground p-1 shrink-0">
                      <ChevronDown className={`size-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-border space-y-3 text-xs animate-in slide-in-from-top-2 duration-150">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-zinc-600 dark:text-zinc-400 text-left">
                        <div>
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">Paid Fees</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{sub.price || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">Start Date</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{sub.start || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">Expiry Date</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{sub.end || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">Status</span>
                          <div className="mt-0.5">
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={sub.status === "Active"} 
                                onChange={() => toggleSubscriptionStatus(sub.id)}
                                className="sr-only peer" 
                              />
                              <div className="w-8 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {filteredSubscriptions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground font-semibold border border-dashed rounded-none">
                No active subscriptions found.
              </div>
            )}
          </div>
        </>
      ) : (
        /* Grid View - Beautiful Premium Cards Layout matching /members */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSubscriptions.map((sub) => (
            <div 
              key={sub.id} 
              className="border border-border bg-card hover:bg-muted/5 transition-all duration-200 p-5 flex flex-col justify-between space-y-4 rounded-none group relative animate-in fade-in zoom-in-95 duration-150 shadow-sm hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${sub.color}`}>
                    {sub.initial}
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 group-hover:text-primary transition-colors">
                      {sub.name}
                    </h3>
                    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[9px] font-bold ${
                      sub.status === "Active" 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" 
                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-400"
                    }`}>
                      <span className={`size-1 rounded-full ${sub.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"}`} />
                      {sub.status}
                    </span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="rounded-none text-muted-foreground cursor-pointer -mr-2 -mt-2">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-none">
                    <DropdownMenuItem className="text-xs font-bold cursor-pointer" onClick={() => setViewingSub(sub)}>
                      <Eye className="size-3.5 mr-2 text-muted-foreground" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold cursor-pointer text-primary" onClick={() => {
                      setMemberEmail(sub.email)
                      setSelectedPlan(sub.plan)
                      setIsSheetOpen(true)
                    }}>
                      <RefreshCw className="size-3.5 mr-2" /> Renew Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20" onClick={() => deleteSubscription(sub.id)}>
                      <Trash2 className="size-3.5 mr-2" /> Delete Subscription
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Plan & Fees details */}
              <div className="space-y-2 text-xs py-2 border-t border-b border-border/50 text-left">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium">Subscription</span>
                  <span className="font-bold text-primary truncate max-w-[170px]" title={sub.plan}>
                    {sub.plan}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Paid Fees</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-200">{sub.price}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium">Expiry Date</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-200">{sub.end}</span>
                </div>
              </div>

              {/* Start Date & Status Toggle */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <div className="space-y-0.5 text-left">
                  <div className="text-muted-foreground text-[10px] font-medium">Start Date</div>
                  <div className="font-bold text-zinc-700 dark:text-zinc-300">{sub.start}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Status</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={sub.status === "Active"} 
                      onChange={() => toggleSubscriptionStatus(sub.id)}
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
          {filteredSubscriptions.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground font-semibold">
              No active subscriptions found.
            </div>
          )}
        </div>
      )}
      </>
      )}

      {/* View Subscription Details Sheet */}
      <Sheet open={viewingSub !== null} onOpenChange={(open) => { if (!open) setViewingSub(null) }}>
        <SheetContent className="sm:!max-w-xl p-6 bg-background">
          <SheetHeader className="pb-6 border-b">
            <div className="flex items-center gap-3">
              <div className={`size-12 rounded-full flex items-center justify-center font-bold text-lg ${viewingSub?.color}`}>
                {viewingSub?.initial}
              </div>
              <div className="text-left">
                <SheetTitle className="font-bold text-xl">{viewingSub?.name}</SheetTitle>
                <SheetDescription className="font-medium text-xs">
                  Active Subscription details and validity
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {viewingSub && (
            <div className="space-y-6 mt-6 text-xs text-left">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Member Email</span>
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{viewingSub.email || "-"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Assigned Tier</span>
                  <span className="font-bold text-sm text-primary">{viewingSub.plan}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Paid Amount</span>
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{viewingSub.price}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Status</span>
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 mt-1 text-[10px] font-bold ${
                    viewingSub.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/40"
                  }`}>
                    {viewingSub.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Start Date</span>
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{viewingSub.start}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Expiry Date</span>
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{viewingSub.end}</span>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    deleteSubscription(viewingSub.id)
                    setViewingSub(null)
                  }} 
                  className="rounded-none font-bold text-xs gap-1"
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setViewingSub(null)} className="rounded-none font-bold text-xs">
                    Close
                  </Button>
                  <Button onClick={() => {
                    setMemberEmail(viewingSub.email)
                    setSelectedPlan(viewingSub.plan)
                    setViewingSub(null)
                    setIsSheetOpen(true)
                  }} className="rounded-none font-bold text-xs gap-1">
                    <RefreshCw className="size-3.5" /> Renew Plan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
