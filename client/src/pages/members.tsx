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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, UserPlus, MoreVertical, LayoutGrid, List, Eye, Edit, Trash2, ChevronDown } from "lucide-react"

export default function MembersPage() {
  const { members, addMember, toggleMemberStatus, editMember, deleteMember } = useLibrary()

  // New member form states
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // Action & Details states
  const [viewingMember, setViewingMember] = React.useState<any | null>(null)
  const [editingMember, setEditingMember] = React.useState<any | null>(null)
  const [deletingMember, setDeletingMember] = React.useState<any | null>(null)
  const [expandedEmails, setExpandedEmails] = React.useState<Record<string, boolean>>({})

  // Edit member form states
  const [editName, setEditName] = React.useState("")
  const [editPhone, setEditPhone] = React.useState("")
  const [editAddress, setEditAddress] = React.useState("")

  // View & Filter states
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"All" | "Active" | "Inactive">("All")

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    const success = await addMember(name, email, phone, address)
    
    if (success) {
      // Reset Form
      setName("")
      setEmail("")
      setPhone("")
      setAddress("")
      setIsSheetOpen(false)
    }
  }

  // Filter & Search logic
  const filteredMembers = React.useMemo(() => {
    return members.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "All" || member.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [members, searchTerm, statusFilter])

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground font-medium">
          View demographics, plan allocations, and outstanding logs.
        </p>
      </div>

      {/* Control bar - Plain/Borderless */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between py-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search user..." 
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
            <option value="Inactive">Inactive</option>
          </select>

          {/* Add Member Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-none gap-1 h-9 cursor-pointer font-semibold">
                <UserPlus className="size-4" /> Add User
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:!max-w-xl p-6 bg-background">
              <SheetHeader className="pb-6">
                <SheetTitle className="font-bold text-xl">Register New Library Member</SheetTitle>
                <SheetDescription className="font-medium">
                  Enter reader details below to create a subscription card and assign a seat.
                </SheetDescription>
              </SheetHeader>
              
              <form onSubmit={handleAddMember} className="flex flex-col flex-1 justify-between">
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Full Name</label>
                    <Input
                      required
                      placeholder="e.g. Amit Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                    <Input
                      required
                      type="email"
                      placeholder="e.g. amit@ethicslibrary.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="e.g. 7050805205"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Address</label>
                    <Input
                      placeholder="e.g. Anaith"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="rounded-none"
                    />
                  </div>
                </div>

                <SheetFooter className="pt-4 border-t mt-auto">
                  <SheetClose asChild>
                    <Button type="button" variant="outline" className="rounded-none w-full cursor-pointer font-bold">Cancel</Button>
                  </SheetClose>
                  <Button type="submit" className="rounded-none w-full cursor-pointer font-bold">Add Member</Button>
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
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4">By</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 w-[100px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/10 transition-colors last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${member.color}`}>
                          {member.initial}
                        </div>
                        <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{member.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">{member.email}</td>
                    <td className="p-4 text-muted-foreground font-medium">{member.phone}</td>
                    <td className="p-4 text-muted-foreground font-medium">{member.address}</td>
                    <td className="p-4 text-muted-foreground font-medium">{member.joined}</td>
                    <td className="p-4 text-muted-foreground font-medium">{member.lastLogin}</td>
                    <td className="p-4">
                      {member.by === "App" ? (
                        <span className="bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">App</span>
                      ) : (
                        <span className="text-muted-foreground font-medium">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* CSS Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={member.status === "Active"} 
                            onChange={() => toggleMemberStatus(member.email)}
                            className="sr-only peer" 
                          />
                          <div className="w-8 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                          member.status === "Active" 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" 
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-400"
                        }`}>
                          <span className={`size-1.5 rounded-full ${member.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"}`} />
                          {member.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="rounded-none text-muted-foreground cursor-pointer">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer" onClick={() => setViewingMember(member)}>
                            <Eye className="size-3.5 mr-2 text-muted-foreground" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer" onClick={() => {
                            setEditingMember(member)
                            setEditName(member.name)
                            setEditPhone(member.phone)
                            setEditAddress(member.address)
                          }}>
                            <Edit className="size-3.5 mr-2 text-muted-foreground" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold cursor-pointer text-red-600 focus:text-red-600" onClick={() => setDeletingMember(member)}>
                            <Trash2 className="size-3.5 mr-2" /> Delete Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground font-semibold">
                      No members found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="h-8" />

          {/* Mobile Collapsible Cards View */}
          <div className="block md:hidden space-y-3">
            {filteredMembers.map((member) => {
              const isExpanded = !!expandedEmails[member.email]
              return (
                <div key={member.email} className="border border-border bg-card p-4 rounded-none space-y-3 shadow-sm hover:shadow-md transition-shadow">
                  {/* Card Header (Always visible) */}
                  <div 
                    className="flex items-center justify-between cursor-pointer select-none" 
                    onClick={() => setExpandedEmails(prev => ({ ...prev, [member.email]: !prev[member.email] }))}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center font-bold text-xs ${member.color}`}>
                        {member.initial}
                      </div>
                      <div className="space-y-0.5 leading-tight text-left">
                        <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{member.name}</h3>
                        <p className="text-[11px] text-muted-foreground font-medium break-all">{member.email}</p>
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
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">Phone</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{member.phone || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">Address</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{member.address || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">Joined</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{member.joined || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">Last Login</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{member.lastLogin || "-"}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">By Source</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{member.by === "App" ? "App Portal" : "Admin"}</span>
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] uppercase text-muted-foreground mb-0.5">Status</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={member.status === "Active"} 
                                onChange={() => toggleMemberStatus(member.email)}
                                className="sr-only peer" 
                              />
                              <div className="w-8 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                            <span className="font-bold text-[10px]">{member.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer h-8"
                          onClick={() => setViewingMember(member)}
                        >
                          <Eye className="size-3 mr-1" /> Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer h-8"
                          onClick={() => {
                            setEditingMember(member)
                            setEditName(member.name)
                            setEditPhone(member.phone)
                            setEditAddress(member.address)
                          }}
                        >
                          <Edit className="size-3 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="w-full text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer h-8"
                          onClick={() => setDeletingMember(member)}
                        >
                          <Trash2 className="size-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {filteredMembers.length === 0 && (
              <div className="p-8 text-center text-muted-foreground font-semibold border border-dashed rounded-none">
                No members found matching filters.
              </div>
            )}
          </div>
        </>
      ) : (
        /* Grid View - Beautiful Premium Cards Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMembers.map((member, idx) => (
            <div 
              key={idx} 
              className="border border-border bg-card hover:bg-muted/5 transition-all duration-200 p-5 flex flex-col justify-between space-y-4 rounded-none group relative animate-in fade-in zoom-in-95 duration-150 shadow-sm hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${member.color}`}>
                    {member.initial}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {member.by === "App" ? (
                        <span className="bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 px-1.5 py-0.2 rounded text-[9px] font-bold">App</span>
                      ) : null}
                      <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[9px] font-bold ${
                        member.status === "Active" 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" 
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-400"
                      }`}>
                        <span className={`size-1 rounded-full ${member.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"}`} />
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="rounded-none text-muted-foreground cursor-pointer -mr-2 -mt-2">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-none">
                    <DropdownMenuItem className="text-xs font-bold cursor-pointer" onClick={() => setViewingMember(member)}>
                      <Eye className="size-3.5 mr-2 text-muted-foreground" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold cursor-pointer" onClick={() => {
                      setEditingMember(member)
                      setEditName(member.name)
                      setEditPhone(member.phone)
                      setEditAddress(member.address)
                    }}>
                      <Edit className="size-3.5 mr-2 text-muted-foreground" /> Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold cursor-pointer text-red-600 focus:text-red-600" onClick={() => setDeletingMember(member)}>
                      <Trash2 className="size-3.5 mr-2" /> Delete Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Contact / Location Details */}
              <div className="space-y-2 text-xs py-2 border-t border-b border-border/50">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium">Email</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-200 truncate max-w-[170px]" title={member.email}>
                    {member.email}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Phone</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-200">{member.phone}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground font-medium">Address</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-200 truncate max-w-[170px]" title={member.address}>
                    {member.address}
                  </span>
                </div>
              </div>

              {/* Dates & Status Toggle */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <div className="space-y-0.5">
                  <div className="text-muted-foreground text-[10px] font-medium">Joined</div>
                  <div className="font-bold text-zinc-700 dark:text-zinc-300">{member.joined}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Status Toggle</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={member.status === "Active"} 
                      onChange={() => toggleMemberStatus(member.email)}
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground font-semibold">
              No members found.
            </div>
          )}
        </div>
      )}

      {/* View Member Details Sheet */}
      <Sheet open={viewingMember !== null} onOpenChange={(open) => { if (!open) setViewingMember(null) }}>
        <SheetContent className="sm:!max-w-xl p-6 bg-background">
          <SheetHeader className="pb-6 border-b">
            <div className="flex items-center gap-3">
              <div className={`size-12 rounded-full flex items-center justify-center font-bold text-lg ${viewingMember?.color}`}>
                {viewingMember?.initial}
              </div>
              <div className="text-left">
                <SheetTitle className="font-bold text-xl">{viewingMember?.name}</SheetTitle>
                <SheetDescription className="font-medium text-xs">
                  Joined Ethics Library on {viewingMember?.joined}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {viewingMember && (
            <div className="space-y-6 mt-6 text-xs text-left">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Email Address</span>
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{viewingMember.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Phone Number</span>
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{viewingMember.phone || "-"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Postal Address</span>
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{viewingMember.address || "-"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Registration Source</span>
                  <span className="font-bold text-sm text-purple-600">{viewingMember.by || "Manual Admin"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Account Status</span>
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 mt-1 text-[10px] font-bold ${
                    viewingMember.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/40"
                  }`}>
                    {viewingMember.status}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider block text-[10px]">Last Active Portal Login</span>
                  <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{viewingMember.lastLogin || "N/A"}</span>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button onClick={() => setViewingMember(null)} className="rounded-none font-bold text-xs">
                  Close Profile
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Member Details Sheet */}
      <Sheet open={editingMember !== null} onOpenChange={(open) => { if (!open) setEditingMember(null) }}>
        <SheetContent className="sm:!max-w-xl p-6 bg-background">
          <SheetHeader className="pb-6 border-b">
            <SheetTitle className="font-bold text-xl text-left">Edit Member Information</SheetTitle>
            <SheetDescription className="font-medium text-left">
              Update name, phone number, and address fields below. Email cannot be modified.
            </SheetDescription>
          </SheetHeader>

          {editingMember && (
            <form onSubmit={(e) => {
              e.preventDefault()
              editMember(editingMember.email, {
                name: editName,
                phone: editPhone,
                address: editAddress
              })
              setEditingMember(null)
            }} className="flex flex-col flex-1 justify-between mt-6 h-[calc(100%-100px)] text-left">
              <div className="space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Email (Read Only)</label>
                  <Input disabled value={editingMember.email} className="rounded-none bg-muted cursor-not-allowed" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Full Name</label>
                  <Input required value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Phone Number</label>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="rounded-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Address</label>
                  <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="rounded-none" />
                </div>
              </div>

              <SheetFooter className="pt-4 border-t mt-auto flex gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingMember(null)} className="rounded-none w-full font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none w-full font-bold">
                  Save Changes
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deletingMember !== null} onOpenChange={(open) => { if (!open) setDeletingMember(null) }}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold">Delete Member</AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              Are you sure you want to permanently delete <span className="font-bold text-foreground">{deletingMember?.name}</span>? This action cannot be undone and all associated data will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none font-bold cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              onClick={() => {
                if (deletingMember) {
                  deleteMember(deletingMember.email)
                  setDeletingMember(null)
                }
              }}
            >
              <Trash2 className="size-3.5 mr-1.5" />
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
