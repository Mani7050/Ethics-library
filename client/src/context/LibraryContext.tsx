import * as React from "react"
import { useDispatch, useSelector } from "react-redux"
import { store } from "../store"
import type { RootState } from "../store"
import * as actions from "../store/librarySlice"


export interface Member {
  name: string
  email: string
  phone: string
  address: string
  joined: string
  lastLogin: string
  by: string
  status: "Active" | "Inactive"
  initial: string
  color: string
}

export interface Seat {
  id: number
  status: "Available" | "Occupied" | "Reserved" | "Maintenance" | "Away"
  occupiedBy: string
  occupiedByEmail: string
  checkInTime?: string
  maintenanceDesc?: string
  category: string
  assignedShift?: "Morning" | "Evening" | "Night" | "Full Day"
  awaySince?: string
}

export interface AttendanceLog {
  id: string
  name: string
  email: string
  seat: string
  date: string
  checkIn: string
  checkOut: string
  hours: string
  status: "Inside" | "Checked Out" | "Away"
  initial: string
  color: string
}

export interface Transaction {
  id: number
  name: string
  email: string
  plan: string
  amount: string
  method: string
  status: "Paid"
  date: string
  initial: string
  color: string
}

export interface Expense {
  id: number
  title: string
  category: string
  amount: string
  status: "Paid"
  date: string
  initial: string
  color: string
}

export interface Subscription {
  id: string
  name: string
  email: string
  plan: string
  price: string
  start: string
  end: string
  status: "Active" | "Expired"
  initial: string
  color: string
}

export interface Plan {
  id: string
  name: string
  price: string
  duration: string
  type: string
  desc: string
  iconName?: string
  color?: string
}

export interface Toast {
  id: string
  message: string
  type: "success" | "info" | "warning" | "error"
}

interface LibraryContextType {
  members: Member[]
  seats: Seat[]
  attendanceLogs: AttendanceLog[]
  transactions: Transaction[]
  expenses: Expense[]
  subscriptions: Subscription[]
  plans: Plan[]
  toasts: Toast[]
  addToast: (message: string, type?: Toast["type"]) => void
  removeToast: (id: string) => void
  addMember: (name: string, email: string, phone: string, address: string) => Promise<boolean>
  toggleMemberStatus: (email: string) => Promise<void>
  editMember: (email: string, updatedData: Partial<Member>) => Promise<void>
  deleteMember: (email: string) => Promise<void>
  assignSeat: (seatId: number, memberEmail: string, customTime?: string, shiftName?: string) => Promise<boolean>
  releaseSeat: (seatId: number) => Promise<void>
  transferSeat: (fromSeatId: number, toSeatId: number) => Promise<boolean>
  updateSeatStatus: (seatId: number, status: Seat["status"], desc?: string) => Promise<void>
  toggleSeatAway: (seatId: number) => Promise<void>
  checkInMember: (memberEmail: string, seatId: number) => Promise<boolean>
  checkOutMember: (logId: string) => Promise<void>
  collectFee: (memberEmail: string, planName: string, amount: number, method: string) => Promise<void>
  logExpense: (title: string, category: string, amount: number) => Promise<void>
  assignMembership: (memberEmail: string, planName: string) => Promise<boolean>
  toggleSubscriptionStatus: (id: string) => Promise<void>
  deleteSubscription: (id: string) => Promise<void>
  createPlan: (planData: { name: string; price: string; duration?: string; type?: string; desc?: string }) => Promise<boolean>
  deletePlan: (idOrName: string) => Promise<boolean>
  addNewSeat: (category: Seat["category"], customSeatNumber?: number) => Promise<void>
  editOccupiedSeatTimings: (seatId: number, checkInTime: string, assignedShift: Seat["assignedShift"]) => Promise<void>
  renameCategory: (oldName: string, newName: string) => Promise<void>
  deleteCategory: (categoryName: string) => Promise<void>
}

const LibraryContext = React.createContext<LibraryContextType | undefined>(undefined)

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Automatic fetch interceptor to inject Authorization headers dynamically
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  const token = localStorage.getItem("authToken");
  const url = typeof input === "string" ? input : (input as any).url;

  if (url && url.includes("/api/") && !url.includes("/auth/login") && !url.includes("/auth/register")) {
    init = init || {};
    const headers = new Headers(init.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    init.headers = headers;
  }
  const res = await originalFetch(input, init);
  if ((res.status === 401 || res.status === 403) && token) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isLoggedIn");
  }
  return res;
};

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const members = useSelector((state: RootState) => state.library.members)
  const seats = useSelector((state: RootState) => state.library.seats)
  const attendanceLogs = useSelector((state: RootState) => state.library.attendanceLogs)
  const transactions = useSelector((state: RootState) => state.library.transactions)
  const expenses = useSelector((state: RootState) => state.library.expenses)
  const subscriptions = useSelector((state: RootState) => state.library.subscriptions)
  const plans = useSelector((state: RootState) => state.library.plans)
  const toasts = useSelector((state: RootState) => state.library.toasts)

  // Local helper functions to map state modifications to Redux dispatch actions
  const setMembers = React.useCallback((m: Member[] | ((prev: Member[]) => Member[])) => {
    if (typeof m === "function") {
      dispatch(actions.setMembers(m(store.getState().library.members)))
    } else {
      dispatch(actions.setMembers(m))
    }
  }, [dispatch])

  const setSeats = React.useCallback((s: Seat[] | ((prev: Seat[]) => Seat[])) => {
    if (typeof s === "function") {
      dispatch(actions.setSeats(s(store.getState().library.seats)))
    } else {
      dispatch(actions.setSeats(s))
    }
  }, [dispatch])

  const setAttendanceLogs = React.useCallback((l: AttendanceLog[] | ((prev: AttendanceLog[]) => AttendanceLog[])) => {
    if (typeof l === "function") {
      dispatch(actions.setAttendanceLogs(l(store.getState().library.attendanceLogs)))
    } else {
      dispatch(actions.setAttendanceLogs(l))
    }
  }, [dispatch])

  const setTransactions = React.useCallback((t: Transaction[] | ((prev: Transaction[]) => Transaction[])) => {
    if (typeof t === "function") {
      dispatch(actions.setTransactions(t(store.getState().library.transactions)))
    } else {
      dispatch(actions.setTransactions(t))
    }
  }, [dispatch])

  const setExpenses = React.useCallback((e: Expense[] | ((prev: Expense[]) => Expense[])) => {
    if (typeof e === "function") {
      dispatch(actions.setExpenses(e(store.getState().library.expenses)))
    } else {
      dispatch(actions.setExpenses(e))
    }
  }, [dispatch])

  const setSubscriptions = React.useCallback((s: Subscription[] | ((prev: Subscription[]) => Subscription[])) => {
    if (typeof s === "function") {
      dispatch(actions.setSubscriptions(s(store.getState().library.subscriptions)))
    } else {
      dispatch(actions.setSubscriptions(s))
    }
  }, [dispatch])

  const setPlans = React.useCallback((p: Plan[] | ((prev: Plan[]) => Plan[])) => {
    if (typeof p === "function") {
      dispatch(actions.setPlans(p(store.getState().library.plans)))
    } else {
      dispatch(actions.setPlans(p))
    }
  }, [dispatch])

  // Fetch initial data from Backend server
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, seatsRes, logsRes, txsRes, expsRes, subsRes, plansRes] = await Promise.all([
          fetch(`${API_BASE_URL}/members`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/seats`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/attendance`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/transactions`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/expenses`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/subscriptions`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/plans`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
        ]);

        setMembers(membersRes);
        setSeats(seatsRes);
        setAttendanceLogs(logsRes);
        setTransactions(txsRes);
        setExpenses(expsRes);
        setSubscriptions(subsRes);
        setPlans(plansRes);
      } catch (err) {
        console.warn("Backend not reachable, starting with empty data.", err);
        setMembers([]);
        setSeats([]);
        setAttendanceLogs([]);
        setTransactions([]);
        setExpenses([]);
        setSubscriptions([]);
        setPlans([]);
      }
    };
    fetchData();
  }, []);

  // Toast functions
  const addToast = React.useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9)
    dispatch(actions.addToastAction({ id, message, type }))
    setTimeout(() => {
      dispatch(actions.removeToastAction(id))
    }, 4000)
  }, [dispatch])

  const removeToast = React.useCallback((id: string) => {
    dispatch(actions.removeToastAction(id))
  }, [dispatch])

  // Core Member actions
  const addMember = async (name: string, email: string, phone: string, address: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address }),
      })
      if (!res.ok) {
        const data = await res.json()
        addToast(data.error || "Failed to register member", "error")
        return false
      }
      const newMember = await res.json()
      setMembers((prev) => [newMember, ...prev])
      addToast(`Member ${name} registered successfully!`, "success")
      return true
    } catch (err) {
      addToast("Failed to connect to backend", "error")
      return false
    }
  }

  const toggleMemberStatus = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/members/${email}/toggle`, {
        method: "PATCH",
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setMembers((prev) => prev.map((m) => (m.email.toLowerCase() === email.toLowerCase() ? updated : m)))
      addToast(`Member status updated to ${updated.status}`, "info")
    } catch (err) {
      addToast("Failed to update status", "error")
    }
  }

  const editMember = async (email: string, updatedData: Partial<Member>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/members/${email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setMembers((prev) => prev.map((m) => (m.email.toLowerCase() === email.toLowerCase() ? updated : m)))
      addToast("Member details updated successfully", "success")
    } catch (err) {
      addToast("Failed to edit member", "error")
    }
  }

  const deleteMember = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/members/${email}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      setMembers((prev) => prev.filter((m) => m.email.toLowerCase() !== email.toLowerCase()))
      addToast("Member deleted from registry", "info")
    } catch (err) {
      addToast("Failed to delete member", "error")
    }
  }

  // Core Seat assignment actions
  const assignSeat = async (seatId: number, memberEmail: string, customTime?: string, shiftName?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatId, memberEmail, customTime, shiftName }),
      })
      if (!res.ok) {
        const data = await res.json()
        addToast(data.error || "Failed to assign seat", "error")
        return false
      }
      const { seat: updatedSeat, log: newLog } = await res.json()
      
      setSeats((prev) => prev.map((s) => (s.id === seatId ? updatedSeat : s)))
      setAttendanceLogs((prev) => [newLog, ...prev])
      
      // Update lastLogin of member in local state
      const loginOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }
      const formattedLogin = new Date().toLocaleDateString("en-US", loginOptions)
      setMembers((prev) => prev.map((m) => (m.email === memberEmail ? { ...m, lastLogin: formattedLogin } : m)))

      addToast(`Seat #${seatId} assigned successfully`, "success")
      return true
    } catch (err) {
      addToast("Failed to assign seat", "error")
      return false
    }
  }

  const releaseSeat = async (seatId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/release`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatId }),
      })
      if (!res.ok) throw new Error()
      const { seat: updatedSeat } = await res.json()
      
      setSeats((prev) => prev.map((s) => (s.id === seatId ? updatedSeat : s)))
      
      // Fetch fresh logs to sync checkout status
      const logs = await fetch(`${API_BASE_URL}/attendance`).then((r) => r.json())
      setAttendanceLogs(logs)
      
      addToast(`Seat #${seatId} released.`, "info")
    } catch (err) {
      addToast("Failed to release seat", "error")
    }
  }

  const transferSeat = async (fromSeatId: number, toSeatId: number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromSeatId, toSeatId }),
      })
      if (!res.ok) {
        const data = await res.json()
        addToast(data.error || "Failed to transfer seat", "error")
        return false
      }
      const { fromSeat, toSeat } = await res.json()
      
      setSeats((prev) =>
        prev.map((s) => {
          if (s.id === fromSeatId) return fromSeat
          if (s.id === toSeatId) return toSeat
          return s
        })
      )
      
      // Fetch fresh logs to sync
      const logs = await fetch(`${API_BASE_URL}/attendance`).then((r) => r.json())
      setAttendanceLogs(logs)
      
      addToast(`Transferred Desk #${fromSeatId} occupant to Desk #${toSeatId}`, "success")
      return true
    } catch (err) {
      addToast("Failed to transfer seat", "error")
      return false
    }
  }

  const updateSeatStatus = async (seatId: number, status: Seat["status"], desc?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/${seatId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, desc }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setSeats((prev) => prev.map((s) => (s.id === seatId ? updated : s)))
      addToast(`Seat #${seatId} marked as ${status}`, "info")
    } catch (err) {
      addToast("Failed to update seat status", "error")
    }
  }

  const toggleSeatAway = async (seatId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/${seatId}/away`, {
        method: "POST",
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setSeats((prev) => prev.map((s) => (s.id === seatId ? updated : s)))
      
      // Sync logs
      const logs = await fetch(`${API_BASE_URL}/attendance`).then((r) => r.json())
      setAttendanceLogs(logs)
      
      addToast(
        updated.status === "Away"
          ? `Desk #${seatId} marked as Away`
          : `Desk #${seatId} occupant returned`,
        "info"
      )
    } catch (err) {
      addToast("Failed to toggle away status", "error")
    }
  }

  // Core Attendance logs
  const checkInMember = async (memberEmail: string, seatId: number): Promise<boolean> => {
    return assignSeat(seatId, memberEmail)
  }

  const checkOutMember = async (logId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/check-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      })
      if (!res.ok) throw new Error()
      const updatedLog = await res.json()
      
      // Update log in state
      setAttendanceLogs((prev) => prev.map((l) => (l.id === logId ? updatedLog : l)))
      
      // Sync seats
      const seatsData = await fetch(`${API_BASE_URL}/seats`).then((r) => r.json())
      setSeats(seatsData)
      
      addToast(`Member logged out`, "info")
    } catch (err) {
      addToast("Failed to check out member", "error")
    }
  }

  // Core Finance actions
  const collectFee = async (memberEmail: string, planName: string, amount: number, method: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberEmail, planName, amount, method }),
      })
      if (!res.ok) throw new Error()
      const newTx = await res.json()
      setTransactions((prev) => [newTx, ...prev])
      addToast(`Collected ₹${amount} fee`, "success")
    } catch (err) {
      addToast("Failed to collect fee", "error")
    }
  }

  const logExpense = async (title: string, category: string, amount: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, amount }),
      })
      if (!res.ok) throw new Error()
      const newExp = await res.json()
      setExpenses((prev) => [newExp, ...prev])
      addToast(`Expense logged: ${title} (₹${amount})`, "info")
    } catch (err) {
      addToast("Failed to log expense", "error")
    }
  }

  // Assign Membership Tier
  const assignMembership = async (memberEmail: string, planName: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberEmail, planName }),
      })
      if (!res.ok) {
        const data = await res.json()
        addToast(data.error || "Failed to assign membership", "error")
        return false
      }
      const { subscription, transaction } = await res.json()
      
      setSubscriptions((prev) => [subscription, ...prev])
      setTransactions((prev) => [transaction, ...prev])
      addToast(`Assigned ${planName}`, "success")
      return true
    } catch (err) {
      addToast("Failed to assign membership", "error")
      return false
    }
  }

  const toggleSubscriptionStatus = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/subscriptions/${id}/toggle`, {
        method: "PATCH",
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)))
      addToast(`Subscription status updated to ${updated.status}`, "info")
    } catch (err) {
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: s.status === "Active" ? "Expired" : "Active" } : s
        )
      )
      addToast("Updated subscription status", "info")
    }
  }

  const deleteSubscription = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      setSubscriptions((prev) => prev.filter((s) => s.id !== id))
      addToast("Subscription deleted", "info")
    } catch (err) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id))
      addToast("Subscription deleted", "info")
    }
  }

  const createPlan = async (planData: { name: string; price: string; duration?: string; type?: string; desc?: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      })
      if (!res.ok) {
        const data = await res.json()
        addToast(data.error || "Failed to create plan", "error")
        return false
      }
      const newPlan = await res.json()
      setPlans((prev) => [...prev, newPlan])
      addToast(`New Membership Plan '${newPlan.name}' created successfully!`, "success")
      return true
    } catch (err) {
      addToast("Failed to create plan", "error")
      return false
    }
  }

  const deletePlan = async (idOrName: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/plans/${encodeURIComponent(idOrName)}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      setPlans((prev) => prev.filter((p) => p.id !== idOrName && p.name !== idOrName))
      addToast(`Plan tier '${idOrName}' deleted.`, "info")
      return true
    } catch (err) {
      setPlans((prev) => prev.filter((p) => p.name !== idOrName && p.id !== idOrName))
      addToast(`Plan tier deleted.`, "info")
      return false
    }
  }

  const addNewSeat = async (category: Seat["category"], customSeatNumber?: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, customSeatNumber }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to add new seat")
      }
      const newSeat = await res.json()
      setSeats((prev) => [...prev, newSeat])
      addToast(`New Seat #${newSeat.id} (${category}) added successfully!`, "success")
    } catch (err: any) {
      addToast(err.message || "Failed to add new seat", "error")
    }
  }

  const editOccupiedSeatTimings = async (seatId: number, checkInTime: string, assignedShift: Seat["assignedShift"]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/${seatId}/timings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkInTime, assignedShift }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setSeats((prev) => prev.map((s) => (s.id === seatId ? updated : s)))
      
      // Sync logs
      const logs = await fetch(`${API_BASE_URL}/attendance`).then((r) => r.json())
      setAttendanceLogs(logs)
      
      addToast(`Timings updated for Seat #${seatId}`, "success")
    } catch (err) {
      addToast("Failed to update seat timings", "error")
    }
  }

  const renameCategory = React.useCallback(async (oldName: string, newName: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/category/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName }),
      })
      if (!res.ok) throw new Error()
      setSeats((prev) => prev.map((s) => (s.category === oldName ? { ...s, category: newName } : s)))
      addToast(`Category renamed to "${newName}"`, "info")
    } catch (err) {
      addToast("Failed to rename category", "error")
    }
  }, [addToast])

  const deleteCategory = React.useCallback(async (categoryName: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/category/delete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName }),
      })
      if (!res.ok) throw new Error()
      setSeats((prev) => prev.map((s) => (s.category === categoryName ? { ...s, category: "General Desk" } : s)))
      addToast(`Category "${categoryName}" deleted. Seats reassigned to General Desk.`, "info")
    } catch (err) {
      addToast("Failed to delete category", "error")
    }
  }, [addToast])

  return (
    <LibraryContext.Provider
      value={{
        members,
        seats,
        attendanceLogs,
        transactions,
        expenses,
        subscriptions,
        plans,
        toasts,
        addToast,
        removeToast,
        addMember,
        toggleMemberStatus,
        editMember,
        deleteMember,
        assignSeat,
        releaseSeat,
        transferSeat,
        updateSeatStatus,
        toggleSeatAway,
        checkInMember,
        checkOutMember,
        collectFee,
        logExpense,
        assignMembership,
        toggleSubscriptionStatus,
        deleteSubscription,
        createPlan,
        deletePlan,
        addNewSeat,
        editOccupiedSeatTimings,
        renameCategory,
        deleteCategory,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = React.useContext(LibraryContext)
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider")
  }
  return context
}
