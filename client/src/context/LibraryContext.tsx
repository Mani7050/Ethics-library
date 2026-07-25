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
  addNewSeat: (category: Seat["category"]) => Promise<void>
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
  return originalFetch(input, init);
};

// Default seed data
const defaultMembers: Member[] = [
  { name: "pawan", email: "pawankumar00000000123@gmail.com", phone: "-", address: "-", joined: "Jul 5, 2026 07:09 PM", lastLogin: "N/A", by: "-", status: "Active", initial: "P", color: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" },
  { name: "Maniraj", email: "mraj14558@gmail.com", phone: "7050805205", address: "Anaith", joined: "Jul 5, 2026 11:54 AM", lastLogin: "Jul 24, 2026 06:39 PM", by: "App", status: "Active", initial: "M", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { name: "Ravikant Diwakar", email: "21051499@kiit.ac.in", phone: "-", address: "-", joined: "Jul 4, 2026 08:38 PM", lastLogin: "N/A", by: "-", status: "Active", initial: "RD", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { name: "Ankit", email: "jehenealfaaz28@gmail.com", phone: "-", address: "-", joined: "Jul 4, 2026 07:37 PM", lastLogin: "N/A", by: "-", status: "Active", initial: "A", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { name: "Lav", email: "lalansingh5900@gmail.com", phone: "-", address: "-", joined: "Jul 4, 2026 06:50 PM", lastLogin: "N/A", by: "-", status: "Active", initial: "L", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
]

const initialTransactions: Transaction[] = [
  { id: 101, name: "pawan", email: "pawankumar00000000123@gmail.com", plan: "General Library Access", amount: "₹800", method: "UPI (GPay)", status: "Paid", date: "Jul 23, 2026 10:30 AM", initial: "P", color: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" },
  { id: 102, name: "Maniraj", email: "mraj14558@gmail.com", plan: "VIP Quiet Cabin", amount: "₹3,000", method: "Cash", status: "Paid", date: "Jul 23, 2026 09:15 AM", initial: "M", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: 103, name: "Ravikant Diwakar", email: "21051499@kiit.ac.in", plan: "Premium Reading Desk", amount: "₹1,500", method: "Card", status: "Paid", date: "Jul 22, 2026 04:30 PM", initial: "RD", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { id: 104, name: "Ankit", email: "jehenealfaaz28@gmail.com", plan: "Premium Reading Desk", amount: "₹1,500", method: "UPI (PhonePe)", status: "Paid", date: "Jul 22, 2026 11:20 AM", initial: "A", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: 105, name: "Lav", email: "lalansingh5900@gmail.com", plan: "General Library Access", amount: "₹800", method: "UPI (GPay)", status: "Paid", date: "Jul 21, 2026 06:10 PM", initial: "L", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
]

const initialExpenses: Expense[] = [
  { id: 1, title: "Library Space Rent", category: "Rent", amount: "₹20,000", status: "Paid", date: "Jul 1, 2026", initial: "R", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  { id: 2, title: "Electricity & AC Bill", category: "Utility", amount: "₹8,000", status: "Paid", date: "Jul 10, 2026", initial: "U", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  { id: 3, title: "Assistant Staff Salary", category: "Salary", amount: "₹7,000", status: "Paid", date: "Jul 20, 2026", initial: "S", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
  { id: 4, title: "High-Speed Wi-Fi Router Recharge", category: "Utility", amount: "₹1,500", status: "Paid", date: "Jul 22, 2026", initial: "U", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
]

const initialSubscriptions: Subscription[] = [
  { id: "sub-1", name: "pawan", email: "pawankumar00000000123@gmail.com", plan: "General Library Access", price: "₹800", start: "Jul 5, 2026", end: "Aug 5, 2026", status: "Active", initial: "P", color: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" },
  { id: "sub-2", name: "Maniraj", email: "mraj14558@gmail.com", plan: "VIP Quiet Cabin", price: "₹3,000", start: "Jul 5, 2026", end: "Aug 5, 2026", status: "Active", initial: "M", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: "sub-3", name: "Ravikant Diwakar", email: "21051499@kiit.ac.in", plan: "Premium Reading Desk", price: "₹1,500", start: "Jul 4, 2026", end: "Aug 4, 2026", status: "Active", initial: "RD", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { id: "sub-4", name: "Ankit", email: "jehenealfaaz28@gmail.com", plan: "Premium Reading Desk", price: "₹1,500", start: "Jul 4, 2026", end: "Aug 4, 2026", status: "Active", initial: "A", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: "sub-5", name: "Lav", email: "lalansingh5900@gmail.com", plan: "General Library Access", price: "₹800", start: "Jul 4, 2026", end: "Aug 4, 2026", status: "Active", initial: "L", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
]

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const members = useSelector((state: RootState) => state.library.members)
  const seats = useSelector((state: RootState) => state.library.seats)
  const attendanceLogs = useSelector((state: RootState) => state.library.attendanceLogs)
  const transactions = useSelector((state: RootState) => state.library.transactions)
  const expenses = useSelector((state: RootState) => state.library.expenses)
  const subscriptions = useSelector((state: RootState) => state.library.subscriptions)
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

  // Fetch initial data from Backend server
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, seatsRes, logsRes, txsRes, expsRes, subsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/members`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/seats`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/attendance`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/transactions`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/expenses`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
          fetch(`${API_BASE_URL}/subscriptions`).then((res) => { if (!res.ok) throw new Error(); return res.json(); }),
        ]);

        setMembers(membersRes);
        setSeats(seatsRes);
        setAttendanceLogs(logsRes);
        setTransactions(txsRes);
        setExpenses(expsRes);
        setSubscriptions(subsRes);
      } catch (err) {
        console.warn("Backend server not reachable, falling back to localStorage", err);
        // Fallback to localStorage
        const localMembers = localStorage.getItem("ethics_members");
        const localSeats = localStorage.getItem("ethics_seats");
        const localAttendance = localStorage.getItem("ethics_attendance");
        const localTransactions = localStorage.getItem("ethics_transactions");
        const localExpenses = localStorage.getItem("ethics_expenses");
        const localSubscriptions = localStorage.getItem("ethics_subscriptions");

        if (localMembers) setMembers(JSON.parse(localMembers));
        else setMembers(defaultMembers);

        if (localSeats) setSeats(JSON.parse(localSeats));
        else {
          const generated = Array.from({ length: 60 }, (_, idx) => {
            const id = idx + 1;
            let status: Seat["status"] = "Available";
            let occupiedBy = "";
            let occupiedByEmail = "";
            let checkInTime = "";
            let assignedShift: Seat["assignedShift"] = undefined;
            const category: Seat["category"] = id <= 30 ? "General Desk" : id <= 50 ? "Premium Desk" : "VIP Cabin";
            if (id === 4) {
              status = "Occupied"; occupiedBy = "Maniraj"; occupiedByEmail = "mraj14558@gmail.com"; checkInTime = "09:15 AM"; assignedShift = "Full Day";
            } else if (id === 15) {
              status = "Occupied"; occupiedBy = "Ankit"; occupiedByEmail = "jehenealfaaz28@gmail.com"; checkInTime = "10:00 AM"; assignedShift = "Full Day";
            } else if ([5, 12, 28, 45, 59].includes(id)) {
              status = "Reserved";
            } else if ([17, 33, 48].includes(id)) {
              status = "Maintenance";
            }
            return { id, status, occupiedBy, occupiedByEmail, checkInTime, category, assignedShift };
          });
          setSeats(generated);
        }

        if (localAttendance) setAttendanceLogs(JSON.parse(localAttendance));
        else {
          setAttendanceLogs([
            { id: "log-1", name: "Maniraj", email: "mraj14558@gmail.com", seat: "Desk 04", date: "Jul 24, 2026", checkIn: "09:15 AM", checkOut: "--", hours: "Ongoing", status: "Inside", initial: "M", color: "bg-orange-100 text-orange-700" },
            { id: "log-2", name: "Ankit", email: "jehenealfaaz28@gmail.com", seat: "Desk 15", date: "Jul 24, 2026", checkIn: "10:00 AM", checkOut: "--", hours: "Ongoing", status: "Inside", initial: "A", color: "bg-orange-100 text-orange-700" },
            { id: "log-3", name: "pawan", email: "pawankumar00000000123@gmail.com", seat: "Desk 12", date: "Jul 24, 2026", checkIn: "08:30 AM", checkOut: "05:00 PM", hours: "8.5 hrs", status: "Checked Out", initial: "P", color: "bg-pink-100 text-pink-700" },
            { id: "log-4", name: "Ravikant Diwakar", email: "21051499@kiit.ac.in", seat: "Desk 32", date: "Jul 24, 2026", checkIn: "08:00 AM", checkOut: "04:30 PM", hours: "8.5 hrs", status: "Checked Out", initial: "RD", color: "bg-emerald-100 text-emerald-700" },
            { id: "log-5", name: "Lav", email: "lalansingh5900@gmail.com", seat: "Desk 08", date: "Jul 24, 2026", checkIn: "07:30 AM", checkOut: "03:45 PM", hours: "8.25 hrs", status: "Checked Out", initial: "L", color: "bg-purple-100 text-purple-700" },
          ]);
        }

        if (localTransactions) setTransactions(JSON.parse(localTransactions));
        else setTransactions(initialTransactions);

        if (localExpenses) setExpenses(JSON.parse(localExpenses));
        else setExpenses(initialExpenses);

        if (localSubscriptions) setSubscriptions(JSON.parse(localSubscriptions));
        else setSubscriptions(initialSubscriptions);
      }
    };
    fetchData();
  }, []);

  // Write caching to local storage
  React.useEffect(() => {
    if (members.length > 0) localStorage.setItem("ethics_members", JSON.stringify(members))
  }, [members])

  React.useEffect(() => {
    if (seats.length > 0) localStorage.setItem("ethics_seats", JSON.stringify(seats))
  }, [seats])

  React.useEffect(() => {
    if (attendanceLogs.length > 0) localStorage.setItem("ethics_attendance", JSON.stringify(attendanceLogs))
  }, [attendanceLogs])

  React.useEffect(() => {
    if (transactions.length > 0) localStorage.setItem("ethics_transactions", JSON.stringify(transactions))
  }, [transactions])

  React.useEffect(() => {
    if (expenses.length > 0) localStorage.setItem("ethics_expenses", JSON.stringify(expenses))
  }, [expenses])

  React.useEffect(() => {
    if (subscriptions.length > 0) localStorage.setItem("ethics_subscriptions", JSON.stringify(subscriptions))
  }, [subscriptions])

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

  const addNewSeat = async (category: Seat["category"]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/seats/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      })
      if (!res.ok) throw new Error()
      const newSeat = await res.json()
      setSeats((prev) => [...prev, newSeat])
      addToast(`New Seat #${newSeat.id} (${category}) added successfully!`, "success")
    } catch (err) {
      addToast("Failed to add new seat", "error")
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
