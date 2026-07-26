import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Member, Seat, AttendanceLog, Transaction, Expense, Subscription, Plan, Toast } from "../context/LibraryContext";

interface LibraryState {
  members: Member[];
  seats: Seat[];
  attendanceLogs: AttendanceLog[];
  transactions: Transaction[];
  expenses: Expense[];
  subscriptions: Subscription[];
  plans: Plan[];
  toasts: Toast[];
}

const initialState: LibraryState = {
  members: [],
  seats: [],
  attendanceLogs: [],
  transactions: [],
  expenses: [],
  subscriptions: [],
  plans: [],
  toasts: [],
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setMembers(state, action: PayloadAction<Member[]>) {
      state.members = action.payload;
    },
    setSeats(state, action: PayloadAction<Seat[]>) {
      state.seats = action.payload;
    },
    setAttendanceLogs(state, action: PayloadAction<AttendanceLog[]>) {
      state.attendanceLogs = action.payload;
    },
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
    },
    setExpenses(state, action: PayloadAction<Expense[]>) {
      state.expenses = action.payload;
    },
    setSubscriptions(state, action: PayloadAction<Subscription[]>) {
      state.subscriptions = action.payload;
    },
    setPlans(state, action: PayloadAction<Plan[]>) {
      state.plans = action.payload;
    },
    addToastAction(state, action: PayloadAction<Toast>) {
      state.toasts.push(action.payload);
    },
    removeToastAction(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    addMemberAction(state, action: PayloadAction<Member>) {
      state.members.unshift(action.payload);
    },
    updateMemberAction(state, action: PayloadAction<Member>) {
      state.members = state.members.map((m) =>
        m.email.toLowerCase() === action.payload.email.toLowerCase() ? action.payload : m
      );
    },
    deleteMemberAction(state, action: PayloadAction<string>) {
      state.members = state.members.filter(
        (m) => m.email.toLowerCase() !== action.payload.toLowerCase()
      );
    },
    updateSeatAction(state, action: PayloadAction<Seat>) {
      state.seats = state.seats.map((s) => (s.id === action.payload.id ? action.payload : s));
    },
    addAttendanceLogAction(state, action: PayloadAction<AttendanceLog>) {
      state.attendanceLogs.unshift(action.payload);
    },
    updateAttendanceLogAction(state, action: PayloadAction<AttendanceLog>) {
      state.attendanceLogs = state.attendanceLogs.map((l) =>
        l.id === action.payload.id ? action.payload : l
      );
    },
    addTransactionAction(state, action: PayloadAction<Transaction>) {
      state.transactions.unshift(action.payload);
    },
    addExpenseAction(state, action: PayloadAction<Expense>) {
      state.expenses.unshift(action.payload);
    },
    addSubscriptionAction(state, action: PayloadAction<Subscription>) {
      state.subscriptions.unshift(action.payload);
    },
  },
});

export const {
  setMembers,
  setSeats,
  setAttendanceLogs,
  setTransactions,
  setExpenses,
  setSubscriptions,
  setPlans,
  addToastAction,
  removeToastAction,
  addMemberAction,
  updateMemberAction,
  deleteMemberAction,
  updateSeatAction,
  addAttendanceLogAction,
  updateAttendanceLogAction,
  addTransactionAction,
  addExpenseAction,
  addSubscriptionAction,
} = librarySlice.actions;

export default librarySlice.reducer;
