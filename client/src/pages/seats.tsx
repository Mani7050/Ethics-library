import * as React from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useLibrary, type Seat } from "@/context/LibraryContext"
import { ArrowRightLeft, UserPlus, Trash2, ShieldAlert, Pencil } from "lucide-react"

export default function SeatsPage() {
  const { 
    seats, 
    assignSeat, 
    releaseSeat, 
    transferSeat, 
    updateSeatStatus, 
    toggleSeatAway,
    addNewSeat,
    editOccupiedSeatTimings,
    renameCategory,
    deleteCategory,
    members,
    addToast
  } = useLibrary()

  const [selectedSeatId, setSelectedSeatId] = React.useState<number | null>(null)
  
  // Category filter state for seat layout view
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All")
  
  // Interaction form states
  const [assigneeEmail, setAssigneeEmail] = React.useState("")
  const [customTime, setCustomTime] = React.useState("")
  const [selectedShift, setSelectedShift] = React.useState<"Morning" | "Evening" | "Night" | "Full Day">("Full Day")
  const [transferTargetId, setTransferTargetId] = React.useState<number | "">("")
  const [operationalStatus, setOperationalStatus] = React.useState<Seat["status"]>("Available")
  const [maintenanceNotes, setMaintenanceNotes] = React.useState("")

  // Timing editing form states
  const [editCheckInTime, setEditCheckInTime] = React.useState("")
  const [editShift, setEditShift] = React.useState<"Morning" | "Evening" | "Night" | "Full Day">("Full Day")
  const [showEditTimingsForm, setShowEditTimingsForm] = React.useState(false)

  // General allotment form states
  const [isAllotMode, setIsAllotMode] = React.useState(false)
  const [isAddSeatMode, setIsAddSeatMode] = React.useState(false)
  const [generalChosenSeatId, setGeneralChosenSeatId] = React.useState<number | "">("")

  // Dynamic seat additions
  const DEFAULT_CATEGORIES = ["General Desk", "Premium Desk", "VIP Cabin"]
  const [newSeatCategory, setNewSeatCategory] = React.useState<string>("")
  const [customSeatNumberInput, setCustomSeatNumberInput] = React.useState<string>("")
  
  const sanitizeCategories = (cats: string[]) => {
    return cats.filter(
      (c) =>
        c &&
        c.toLowerCase() !== "all" &&
        c.toLowerCase() !== "all desk" &&
        c.toLowerCase() !== "all desks"
    )
  }

  const [categoriesList, setCategoriesList] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("ethics_library_categories")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return sanitizeCategories(parsed)
        }
      }
    } catch {}
    const seatCats = seats.map((s) => s.category)
    return sanitizeCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...seatCats])))
  })

  const [isAddingCustomCategory, setIsAddingCustomCategory] = React.useState(false)
  const [customCategoryName, setCustomCategoryName] = React.useState("")
  const [isEditingCustomCategoryName, setIsEditingCustomCategoryName] = React.useState<string | null>(null)
  const [editCategoryNewName, setEditCategoryNewName] = React.useState("")
  const [confirmDeleteCategoryName, setConfirmDeleteCategoryName] = React.useState<string | null>(null)

  // Persist categories in localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("ethics_library_categories", JSON.stringify(categoriesList))
    } catch {}
  }, [categoriesList])

  // Include any seat categories from API that are missing from categoriesList
  React.useEffect(() => {
    const seatCats = Array.from(new Set(seats.map((s) => s.category)))
    setCategoriesList((prev) => {
      const cleaned = sanitizeCategories(prev)
      const missing = sanitizeCategories(seatCats).filter((cat) => !cleaned.includes(cat))
      if (missing.length > 0 || cleaned.length !== prev.length) {
        return Array.from(new Set([...cleaned, ...missing]))
      }
      return prev
    })
  }, [seats])

  const handleCreateCustomCategory = () => {
    const trimmed = customCategoryName.trim()
    if (!trimmed) return
    if (trimmed.toLowerCase() === "all" || trimmed.toLowerCase() === "all desks" || trimmed.toLowerCase() === "all desk") {
      addToast?.("'All Desks' is reserved for filtering. Please enter a specific category name.", "warning")
      return
    }
    if (!categoriesList.includes(trimmed)) {
      setCategoriesList((prev) => [...prev, trimmed])
    }
    setNewSeatCategory(trimmed)
    setCustomCategoryName("")
    setIsAddingCustomCategory(false)
  }

  const handleRenameCategory = () => {
    const trimmed = editCategoryNewName.trim()
    if (!trimmed || !isEditingCustomCategoryName) return
    renameCategory(isEditingCustomCategoryName, trimmed)
    setCategoriesList((prev) => 
      prev.map((cat) => (cat === isEditingCustomCategoryName ? trimmed : cat))
    )
    if (newSeatCategory === isEditingCustomCategoryName) {
      setNewSeatCategory(trimmed)
    }
    if (categoryFilter === isEditingCustomCategoryName) {
      setCategoryFilter(trimmed)
    }
    setIsEditingCustomCategoryName(null)
    setEditCategoryNewName("")
  }

  const handleDeleteCategoryClick = () => {
    if (!newSeatCategory) {
      addToast?.("Please select a seat category first.", "warning")
      return
    }
    setConfirmDeleteCategoryName(newSeatCategory)
  }

  const handleConfirmCategoryDelete = () => {
    if (confirmDeleteCategoryName) {
      deleteCategory(confirmDeleteCategoryName)
      const remainingCats = categoriesList.filter((cat) => cat !== confirmDeleteCategoryName)
      setCategoriesList(remainingCats)

      const fallbackCat = remainingCats[0] || ""
      if (newSeatCategory === confirmDeleteCategoryName) {
        setNewSeatCategory(fallbackCat)
      }
      if (categoryFilter === confirmDeleteCategoryName) {
        setCategoryFilter("All")
      }
      addToast?.(`Category '${confirmDeleteCategoryName}' deleted successfully.`, "info")
      setConfirmDeleteCategoryName(null)
    }
  }

  const selectedSeat = React.useMemo(() => {
    return seats.find((s) => s.id === selectedSeatId) || null
  }, [seats, selectedSeatId])

  // Sync edit states when selected seat changes
  React.useEffect(() => {
    if (selectedSeat) {
      setOperationalStatus(selectedSeat.status)
      setMaintenanceNotes(selectedSeat.maintenanceDesc || "")
      setAssigneeEmail("")
      setTransferTargetId("")
      setCustomTime("")
      setEditCheckInTime(selectedSeat.checkInTime || "")
      setEditShift((selectedSeat.assignedShift as any) || "Full Day")
      setShowEditTimingsForm(false)
    }
  }, [selectedSeat])

  // Dynamic calculations for seat stats
  const totalDesks = seats.length
  const occupiedCount = seats.filter((s) => s.status === "Occupied").length
  const availableCount = seats.filter((s) => s.status === "Available").length
  const reservedCount = seats.filter((s) => s.status === "Reserved").length
  const blockedCount = seats.filter((s) => s.status === "Maintenance").length

  // Filter members that are active and not currently occupying any seat
  const eligibleMembers = React.useMemo(() => {
    return members.filter(
      (m) => m.status === "Active" && !seats.some((s) => s.occupiedByEmail === m.email)
    )
  }, [members, seats])

  // Available seats for transfer
  const availableSeatsForTransfer = React.useMemo(() => {
    return seats.filter((s) => s.status === "Available")
  }, [seats])

  // Computed categories for visual filtering
  const categories = React.useMemo(() => {
    return ["All", ...categoriesList]
  }, [categoriesList])

  // Filter seats shown in visual layout based on category selection
  const filteredSeats = React.useMemo(() => {
    if (categoryFilter === "All") return seats
    return seats.filter((s) => s.category === categoryFilter)
  }, [seats, categoryFilter])

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetSeatId = isAllotMode ? Number(generalChosenSeatId) : selectedSeatId
    if (!targetSeatId || !assigneeEmail) return

    // Format 24h format HH:MM to 12h AM/PM
    let formattedTime: string | undefined = undefined
    if (customTime) {
      const [hourStr, minStr] = customTime.split(":")
      const hour = parseInt(hourStr, 10)
      const ampm = hour >= 12 ? "PM" : "AM"
      const formattedHour = hour % 12 || 12
      const min = minStr || "00"
      formattedTime = `${formattedHour.toString().padStart(2, '0')}:${min} ${ampm}`
    }

    const success = await assignSeat(targetSeatId, assigneeEmail, formattedTime, selectedShift)
    if (success) {
      setAssigneeEmail("")
      setCustomTime("")
      setSelectedShift("Full Day")
      setGeneralChosenSeatId("")
      setIsAllotMode(false)
      setSelectedSeatId(null)
    }
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeatId || !transferTargetId) return
    const success = await transferSeat(selectedSeatId, Number(transferTargetId))
    if (success) {
      setSelectedSeatId(Number(transferTargetId))
      setTransferTargetId("")
    }
  }

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeatId) return
    updateSeatStatus(selectedSeatId, operationalStatus, maintenanceNotes)
  }

  const handleEditTimings = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeatId) return
    editOccupiedSeatTimings(selectedSeatId, editCheckInTime, editShift)
    setShowEditTimingsForm(false)
  }

  const handleAddSeat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSeatCategory) {
      addToast?.("Please select a seat category first.", "warning")
      return
    }
    const customNum = customSeatNumberInput.trim() ? parseInt(customSeatNumberInput.trim(), 10) : undefined
    addNewSeat(newSeatCategory, customNum)
    setCustomSeatNumberInput("")
    setIsAddSeatMode(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Seat & Cabin Status</h1>
          <p className="text-muted-foreground font-medium">
            Visual interactive seat allocation map for Desks 1 to 60.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <Button 
            onClick={() => {
              setIsAddSeatMode(true)
              setIsAllotMode(false)
              setSelectedSeatId(null)
            }}
            variant="outline"
            className="rounded-none font-bold text-xs cursor-pointer h-9 px-3"
          >
            + Add Seat
          </Button>

          <Button 
            onClick={() => {
              setIsAllotMode(true)
              setIsAddSeatMode(false)
              setSelectedSeatId(null)
            }}
            className="rounded-none font-bold text-xs cursor-pointer gap-1.5 h-9"
          >
            <UserPlus className="size-4" /> Allot Seat
          </Button>
        </div>
      </div>

      {/* Seat Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="rounded-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Desks</p>
              <h3 className="text-2xl font-bold">{totalDesks}</h3>
            </div>
            <div className="size-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold">{totalDesks}</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-primary">Occupied</p>
              <h3 className="text-2xl font-bold text-primary">{occupiedCount}</h3>
            </div>
            <div className="size-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">{occupiedCount}</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-emerald-500/20 bg-emerald-50/5 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-500">Available</p>
              <h3 className="text-2xl font-bold text-emerald-500">{availableCount}</h3>
            </div>
            <div className="size-8 rounded bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500 font-bold">{availableCount}</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-blue-500/20 bg-blue-50/5 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-blue-500">Reserved</p>
              <h3 className="text-2xl font-bold text-blue-500">{reservedCount}</h3>
            </div>
            <div className="size-8 rounded bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-500 font-bold">{reservedCount}</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-red-500/20 bg-red-50/5 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-red-500">Blocked</p>
              <h3 className="text-2xl font-bold text-red-500">{blockedCount}</h3>
            </div>
            <div className="size-8 rounded bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-500 font-bold">{blockedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Seat Map Area */}
      <div className="w-full">
        {/* Visual Map */}
        <Card className="w-full rounded-none p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 gap-4">
            <div>
              <CardTitle className="text-base font-bold">Study Room Visual Layout</CardTitle>
              <CardDescription className="font-medium">Select any seat to view reader logs or allocate.</CardDescription>
            </div>
            {/* Map Legends */}
            <div className="flex flex-wrap gap-3 text-[10px] font-bold">
              <div className="flex items-center gap-1">
                <div className="size-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-3 rounded bg-primary" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-3 rounded bg-amber-500" />
                <span>Away (Tea Break)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-3 rounded bg-blue-500" />
                <span>Reserved</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-3 rounded bg-red-500" />
                <span>Blocked</span>
              </div>
            </div>
          </div>

          {/* Category Filter Bar */}
          {categoriesList.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border transition-all cursor-pointer ${
                      categoryFilter === cat
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent"
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat === "All" ? "All Desks" : cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seat Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {filteredSeats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => setSelectedSeatId(seat.id)}
                className={`aspect-square rounded border font-mono text-xs font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                  selectedSeatId === seat.id ? "ring-2 ring-zinc-950 dark:ring-white scale-105" : ""
                } ${
                  seat.status === "Occupied"
                    ? "bg-primary text-primary-foreground border-primary"
                    : seat.status === "Away"
                    ? "bg-amber-500 text-white border-amber-600 animate-pulse"
                    : seat.status === "Reserved"
                    ? "bg-blue-500 text-white border-blue-600"
                    : seat.status === "Maintenance"
                    ? "bg-red-500 text-white border-red-600"
                    : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <span>{seat.id}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Selected Seat Details Slide-over Sheet */}
      <Sheet open={selectedSeatId !== null || isAllotMode || isAddSeatMode} onOpenChange={(open) => { if (!open) { setSelectedSeatId(null); setIsAllotMode(false); setIsAddSeatMode(false); } }}>
        <SheetContent className="sm:!max-w-xl w-full border-l p-6 flex flex-col h-full bg-background overflow-y-auto">
          {isAddSeatMode ? (
            <div className="flex flex-col h-full">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-lg font-bold">Add New Study Seat</SheetTitle>
                <SheetDescription className="font-medium">
                  Create a new study desk or cabin in the system.
                </SheetDescription>
              </SheetHeader>

              <form onSubmit={handleAddSeat} className="flex-1 flex flex-col justify-between mt-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Seat Category</label>
                    <div className="flex gap-2">
                      <select
                        value={newSeatCategory}
                        onChange={(e) => setNewSeatCategory(e.target.value)}
                        className="flex-1 text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                      >
                        <option value="">-- Select Category --</option>
                        {categoriesList.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {newSeatCategory && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEditingCustomCategoryName(newSeatCategory)
                              setEditCategoryNewName(newSeatCategory)
                            }}
                            className="size-9 rounded-none flex items-center justify-center p-0 cursor-pointer"
                            title="Edit Category"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleDeleteCategoryClick}
                            className="size-9 rounded-none flex items-center justify-center p-0 cursor-pointer text-destructive hover:bg-destructive/10"
                            title="Delete Category"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingCustomCategory(true)}
                        className="size-9 rounded-none flex items-center justify-center p-0 font-bold text-lg cursor-pointer"
                        title="Add New Category"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Seat / Desk Number Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Seat / Desk Number (Optional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 5, 10, 101 (Khali chhodne par auto #)"
                      value={customSeatNumberInput}
                      onChange={(e) => setCustomSeatNumberInput(e.target.value)}
                      className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                    />
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Specific desk number likhein ya khali chhodein auto sequential number ke liye.
                    </p>
                  </div>

                  {/* Registered Categories list with direct Edit & Delete */}
                  <div className="pt-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Manage Existing Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {categoriesList.map((cat) => (
                        <div key={cat} className="flex items-center gap-1.5 border border-border px-2.5 py-1 text-xs font-bold bg-muted/40 text-foreground">
                          <span>{cat}</span>
                          <div className="flex items-center gap-1 ml-1.5 border-l pl-1.5 border-border">
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingCustomCategoryName(cat)
                                setEditCategoryNewName(cat)
                              }}
                              className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                              title="Rename Category"
                            >
                              <Pencil className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteCategoryName(cat)}
                              className="text-muted-foreground hover:text-red-600 cursor-pointer p-0.5"
                              title="Delete Category"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {categoriesList.length === 0 && (
                        <div className="text-xs text-muted-foreground font-medium py-1">
                          No categories configured. Click + to add one.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-auto pt-6 border-t">
                  <Button type="submit" size="sm" className="rounded-none font-bold text-[10px] uppercase tracking-wider cursor-pointer">
                    Create Seat
                  </Button>
                </div>
              </form>
            </div>
          ) : isAllotMode ? (
            <div className="flex flex-col h-full">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-lg font-bold">Allot New Seat</SheetTitle>
                <SheetDescription className="font-medium">
                  Assign any available study desk to an active member.
                </SheetDescription>
              </SheetHeader>

              <form onSubmit={handleAssign} className="flex-1 flex flex-col justify-between mt-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Available Seat</label>
                    <select
                      required
                      value={generalChosenSeatId}
                      onChange={(e) => setGeneralChosenSeatId(e.target.value ? Number(e.target.value) : "")}
                      className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                    >
                      <option value="">-- Choose Available Desk --</option>
                      {seats.filter(s => s.status === "Available").map((s) => (
                        <option key={s.id} value={s.id}>Desk #{s.id} ({s.category})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assign Active Member</label>
                    <select
                      required
                      value={assigneeEmail}
                      onChange={(e) => setAssigneeEmail(e.target.value)}
                      className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                    >
                      <option value="">-- Choose Member --</option>
                      {eligibleMembers.map((m) => (
                        <option key={m.email} value={m.email}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Shift Timing</label>
                    <select
                      value={selectedShift}
                      onChange={(e) => setSelectedShift(e.target.value as any)}
                      className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                    >
                      <option value="Morning">Morning Shift (06 AM - 12 PM)</option>
                      <option value="Evening">Evening Shift (12 PM - 06 PM)</option>
                      <option value="Night">Night Shift (06 PM - 12 AM)</option>
                      <option value="Full Day">Full Day Access (06 AM - 11 PM)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Allocation Time (Optional)</label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-auto pt-6 border-t">
                  <Button type="submit" size="sm" className="rounded-none font-bold text-[10px] uppercase tracking-wider cursor-pointer">
                    Confirm Seat
                  </Button>
                </div>
              </form>
            </div>
          ) : selectedSeat ? (
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div>
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-lg font-bold">Seat Desk #{selectedSeat.id} Details</SheetTitle>
                  <SheetDescription className="font-medium">
                    View session timings, check-ins, or change booking status.
                  </SheetDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      selectedSeat.status === "Occupied"
                        ? "bg-primary/20 text-primary"
                        : selectedSeat.status === "Away"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : selectedSeat.status === "Available"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : selectedSeat.status === "Reserved"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30"
                    }`}>
                      {selectedSeat.status}
                    </span>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {selectedSeat.category}
                    </span>
                  </div>
                </SheetHeader>

                <div className="space-y-4 text-xs mt-4">
                  {(selectedSeat.status === "Occupied" || selectedSeat.status === "Away") && (
                    <>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground font-bold">Occupied By:</span>
                        <span className="font-bold text-sm text-primary">{selectedSeat.occupiedBy}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground font-bold">Occupant Email:</span>
                        <span className="font-bold truncate max-w-[150px]">{selectedSeat.occupiedByEmail}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground font-bold">Assigned Shift:</span>
                        <span className="font-bold text-blue-600">{selectedSeat.assignedShift || "Full Day"}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground font-bold">Time Checked In:</span>
                        <span className="font-bold text-emerald-600">{selectedSeat.checkInTime || "--"}</span>
                      </div>
                      {selectedSeat.status === "Away" && (
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-amber-600 font-bold">Away Since:</span>
                          <span className="font-bold text-amber-600">{selectedSeat.awaySince || "--"}</span>
                        </div>
                      )}

                      {/* Session Timings Edit Sub-form */}
                      {showEditTimingsForm ? (
                        <form onSubmit={handleEditTimings} className="space-y-3 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mt-3">
                          <h4 className="text-[10px] uppercase font-bold tracking-wider text-primary">Edit Booking Session Timings</h4>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-muted-foreground uppercase">Check-in Time</label>
                            <input
                              required
                              value={editCheckInTime}
                              onChange={(e) => setEditCheckInTime(e.target.value)}
                              className="w-full text-xs p-1.5 bg-background border border-input rounded-none focus:outline-none font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-muted-foreground uppercase">Shift Timing</label>
                            <select
                              value={editShift}
                              onChange={(e) => setEditShift(e.target.value as any)}
                              className="w-full text-xs p-1.5 bg-background border border-input rounded-none focus:outline-none"
                            >
                              <option value="Morning">Morning Shift (06 AM - 12 PM)</option>
                              <option value="Evening">Evening Shift (12 PM - 06 PM)</option>
                              <option value="Night">Night Shift (06 PM - 12 AM)</option>
                              <option value="Full Day">Full Day Access (06 AM - 11 PM)</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" size="sm" className="h-7 text-[10px] font-bold rounded-none flex-1 cursor-pointer">
                              Save
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowEditTimingsForm(false)} 
                              className="h-7 text-[10px] font-bold rounded-none flex-1 cursor-pointer"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="mt-2 text-right">
                          <button
                            type="button"
                            onClick={() => setShowEditTimingsForm(true)}
                            className="text-[10px] font-bold text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
                          >
                            Edit Timings / Shift
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {selectedSeat.status === "Available" && (
                    <p className="text-muted-foreground font-medium">This desk is clean and available. You can assign it to any registered library member.</p>
                  )}
                  {selectedSeat.status === "Reserved" && (
                    <p className="text-muted-foreground font-medium">Reserved for executive bookings. Blocked for standard walk-ins.</p>
                  )}
                  {selectedSeat.status === "Maintenance" && (
                    <div className="space-y-2">
                      <p className="text-red-500 font-bold flex items-center gap-1">
                        <ShieldAlert className="size-4" /> Blocked for Maintenance
                      </p>
                      {selectedSeat.maintenanceDesc && (
                        <p className="text-muted-foreground bg-muted p-2 border font-mono">
                          Notes: {selectedSeat.maintenanceDesc}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Forms */}
              <div className="space-y-4 pt-4 border-t mt-auto">
                {selectedSeat.status === "Available" && (
                  <form onSubmit={handleAssign} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assign Active Member</label>
                      <select
                        required
                        value={assigneeEmail}
                        onChange={(e) => setAssigneeEmail(e.target.value)}
                        className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                      >
                        <option value="">-- Choose Member --</option>
                        {eligibleMembers.map((m) => (
                          <option key={m.email} value={m.email}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Shift Timing</label>
                      <select
                        value={selectedShift}
                        onChange={(e) => setSelectedShift(e.target.value as any)}
                        className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                      >
                        <option value="Morning">Morning Shift (06 AM - 12 PM)</option>
                        <option value="Evening">Evening Shift (12 PM - 06 PM)</option>
                        <option value="Night">Night Shift (06 PM - 12 AM)</option>
                        <option value="Full Day">Full Day Access (06 AM - 11 PM)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Allocation Time (Optional)</label>
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button type="submit" size="sm" className="rounded-none font-bold text-[10px] uppercase tracking-wider cursor-pointer">
                        Assign Member
                      </Button>
                    </div>
                  </form>
                )}

                {(selectedSeat.status === "Occupied" || selectedSeat.status === "Away") && (
                  <div className="space-y-4">
                    {/* Take Tea Break Toggle */}
                    <div className="space-y-2 border-b pb-4">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Break Management</label>
                      <Button 
                        variant={selectedSeat.status === "Away" ? "default" : "secondary"}
                        onClick={() => toggleSeatAway(selectedSeat.id)} 
                        className="w-full rounded-none h-8 text-xs font-bold cursor-pointer"
                      >
                        {selectedSeat.status === "Occupied" ? "Take Tea Break" : "Return from Break"}
                      </Button>
                    </div>

                    {/* Transfer Form */}
                    {selectedSeat.status === "Occupied" && (
                      <form onSubmit={handleTransfer} className="space-y-2 border-b pb-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Transfer Desk Session</label>
                          <select
                            required
                            value={transferTargetId}
                            onChange={(e) => setTransferTargetId(e.target.value as any)}
                            className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                          >
                            <option value="">-- Select New Desk --</option>
                            {availableSeatsForTransfer.map((s) => (
                              <option key={s.id} value={s.id}>Desk #{s.id}</option>
                            ))}
                          </select>
                        </div>
                        <Button type="submit" variant="outline" className="w-full rounded-none h-8 text-xs font-bold cursor-pointer">
                          <ArrowRightLeft className="size-3.5 mr-1" /> Transfer Seat
                        </Button>
                      </form>
                    )}

                    <Button variant="destructive" onClick={() => releaseSeat(selectedSeat.id)} className="w-full rounded-none h-8 text-xs font-bold cursor-pointer">
                      <Trash2 className="size-3.5 mr-1" /> Release & Log Out
                    </Button>
                  </div>
                )}

                {/* Operations & Maintenance block */}
                <form onSubmit={handleStatusUpdate} className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Change Status</label>
                      <select
                        value={operationalStatus}
                        onChange={(e) => setOperationalStatus(e.target.value as Seat["status"])}
                        className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                      >
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button type="submit" variant="secondary" className="w-full rounded-none h-8 text-xs font-bold cursor-pointer">
                        Update Status
                      </Button>
                    </div>
                  </div>

                  {operationalStatus === "Maintenance" && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Maintenance Notes</label>
                      <input
                        placeholder="e.g. Broken study lamp socket"
                        value={maintenanceNotes}
                        onChange={(e) => setMaintenanceNotes(e.target.value)}
                        className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none"
                      />
                    </div>
                  )}
                </form>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
      {isAddingCustomCategory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-background border border-border p-6 max-w-sm w-full mx-4 shadow-2xl rounded-none relative">
            <h3 className="text-lg font-bold text-foreground mb-1">Add New Category</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Enter a name for the new study space or seating category.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category Name</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Silent Reading Zone"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none focus:border-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateCustomCategory()
                    }
                  }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingCustomCategory(false)
                    setCustomCategoryName("")
                  }}
                  className="rounded-none font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateCustomCategory}
                  className="rounded-none font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditingCustomCategoryName !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-background border border-border p-6 max-w-sm w-full mx-4 shadow-2xl rounded-none relative">
            <h3 className="text-lg font-bold text-foreground mb-1">Edit Category</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Rename the category "{isEditingCustomCategoryName}".
            </p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">New Category Name</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Silent Zone"
                  value={editCategoryNewName}
                  onChange={(e) => setEditCategoryNewName(e.target.value)}
                  className="w-full text-xs p-2 bg-background border border-input rounded-none focus:outline-none focus:border-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameCategory()
                    }
                  }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditingCustomCategoryName(null)
                    setEditCategoryNewName("")
                  }}
                  className="rounded-none font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleRenameCategory}
                  className="rounded-none font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Deleting Category */}
      {confirmDeleteCategoryName && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-background border border-border p-6 max-w-md w-full mx-4 shadow-2xl rounded-none relative text-left">
            <h3 className="text-lg font-bold text-foreground mb-1">Delete Seat Category</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Are you sure you want to delete category <span className="font-bold text-foreground">"{confirmDeleteCategoryName}"</span>? Any seats in this category will be automatically reassigned to <span className="font-bold text-foreground">"General Desk"</span>.
            </p>
            
            <div className="flex justify-end gap-2.5 pt-4 border-t mt-4">
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={() => setConfirmDeleteCategoryName(null)}
                className="rounded-none font-bold text-xs cursor-pointer px-4"
              >
                Cancel
              </Button>
              <Button 
                type="button"
                variant="destructive" 
                size="sm" 
                onClick={handleConfirmCategoryDelete}
                className="rounded-none font-bold text-xs cursor-pointer px-4"
              >
                Delete Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
