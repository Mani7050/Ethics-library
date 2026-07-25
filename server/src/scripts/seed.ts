import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Member } from "../models/Member";
import { Seat } from "../models/Seat";
import { AttendanceLog } from "../models/AttendanceLog";
import { Transaction } from "../models/Transaction";
import { Expense } from "../models/Expense";
import { Subscription } from "../models/Subscription";
import { User } from "../models/User";

dotenv.config();

const defaultMembers = [
  { name: "pawan", email: "pawankumar00000000123@gmail.com", phone: "-", address: "-", joined: "Jul 5, 2026 07:09 PM", lastLogin: "N/A", by: "-", status: "Active", initial: "P", color: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" },
  { name: "Maniraj", email: "mraj14558@gmail.com", phone: "7050805205", address: "Anaith", joined: "Jul 5, 2026 11:54 AM", lastLogin: "Jul 24, 2026 06:39 PM", by: "App", status: "Active", initial: "M", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { name: "Ravikant Diwakar", email: "21051499@kiit.ac.in", phone: "-", address: "-", joined: "Jul 4, 2026 08:38 PM", lastLogin: "N/A", by: "-", status: "Active", initial: "RD", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { name: "Ankit", email: "jehenealfaaz28@gmail.com", phone: "-", address: "-", joined: "Jul 4, 2026 07:37 PM", lastLogin: "N/A", by: "-", status: "Active", initial: "A", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { name: "Lav", email: "lalansingh5900@gmail.com", phone: "-", address: "-", joined: "Jul 4, 2026 06:50 PM", lastLogin: "N/A", by: "-", status: "Active", initial: "L", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
];

const initialTransactions = [
  { id: 101, name: "pawan", email: "pawankumar00000000123@gmail.com", plan: "General Library Access", amount: "₹800", method: "UPI (GPay)", status: "Paid", date: "Jul 23, 2026 10:30 AM", initial: "P", color: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" },
  { id: 102, name: "Maniraj", email: "mraj14558@gmail.com", plan: "VIP Quiet Cabin", amount: "₹3,000", method: "Cash", status: "Paid", date: "Jul 23, 2026 09:15 AM", initial: "M", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: 103, name: "Ravikant Diwakar", email: "21051499@kiit.ac.in", plan: "Premium Reading Desk", amount: "₹1,500", method: "Card", status: "Paid", date: "Jul 22, 2026 04:30 PM", initial: "RD", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { id: 104, name: "Ankit", email: "jehenealfaaz28@gmail.com", plan: "Premium Reading Desk", amount: "₹1,500", method: "UPI (PhonePe)", status: "Paid", date: "Jul 22, 2026 11:20 AM", initial: "A", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: 105, name: "Lav", email: "lalansingh5900@gmail.com", plan: "General Library Access", amount: "₹800", method: "UPI (GPay)", status: "Paid", date: "Jul 21, 2026 06:10 PM", initial: "L", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
];

const initialExpenses = [
  { id: 1, title: "Library Space Rent", category: "Rent", amount: "₹20,000", status: "Paid", date: "Jul 1, 2026", initial: "R", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  { id: 2, title: "Electricity & AC Bill", category: "Utility", amount: "₹8,000", status: "Paid", date: "Jul 10, 2026", initial: "U", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  { id: 3, title: "Assistant Staff Salary", category: "Salary", amount: "₹7,000", status: "Paid", date: "Jul 20, 2026", initial: "S", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
  { id: 4, title: "High-Speed Wi-Fi Router Recharge", category: "Utility", amount: "₹1,500", status: "Paid", date: "Jul 22, 2026", initial: "U", color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
];

const initialSubscriptions = [
  { id: "sub-1", name: "pawan", email: "pawankumar00000000123@gmail.com", plan: "General Library Access", price: "₹800", start: "Jul 5, 2026", end: "Aug 5, 2026", status: "Active", initial: "P", color: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" },
  { id: "sub-2", name: "Maniraj", email: "mraj14558@gmail.com", plan: "VIP Quiet Cabin", price: "₹3,000", start: "Jul 5, 2026", end: "Aug 5, 2026", status: "Active", initial: "M", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: "sub-3", name: "Ravikant Diwakar", email: "21051499@kiit.ac.in", plan: "Premium Reading Desk", price: "₹1,500", start: "Jul 4, 2026", end: "Aug 4, 2026", status: "Active", initial: "RD", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { id: "sub-4", name: "Ankit", email: "jehenealfaaz28@gmail.com", plan: "Premium Reading Desk", price: "₹1,500", start: "Jul 4, 2026", end: "Aug 4, 2026", status: "Active", initial: "A", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: "sub-5", name: "Lav", email: "lalansingh5900@gmail.com", plan: "General Library Access", price: "₹800", start: "Jul 4, 2026", end: "Aug 4, 2026", status: "Active", initial: "L", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
];

const initialAttendanceLogs = [
  { id: "log-1", name: "Maniraj", email: "mraj14558@gmail.com", seat: "Desk 04 (Full Day)", date: "Jul 24, 2026", checkIn: "09:15 AM", checkOut: "--", hours: "Ongoing", status: "Inside", initial: "M", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: "log-2", name: "Ankit", email: "jehenealfaaz28@gmail.com", seat: "Desk 15 (Full Day)", date: "Jul 24, 2026", checkIn: "10:00 AM", checkOut: "--", hours: "Ongoing", status: "Inside", initial: "A", color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
  { id: "log-3", name: "pawan", email: "pawankumar00000000123@gmail.com", seat: "Desk 12", date: "Jul 24, 2026", checkIn: "08:30 AM", checkOut: "05:00 PM", hours: "8.5 hrs", status: "Checked Out", initial: "P", color: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400" },
  { id: "log-4", name: "Ravikant Diwakar", email: "21051499@kiit.ac.in", seat: "Desk 32", date: "Jul 24, 2026", checkIn: "08:00 AM", checkOut: "04:30 PM", hours: "8.5 hrs", status: "Checked Out", initial: "RD", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { id: "log-5", name: "Lav", email: "lalansingh5900@gmail.com", seat: "Desk 08", date: "Jul 24, 2026", checkIn: "07:30 AM", checkOut: "03:45 PM", hours: "8.25 hrs", status: "Checked Out", initial: "L", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ethics";
  console.log(`Connecting to database: ${mongoUri}`);
  await mongoose.connect(mongoUri);

  console.log("Clearing existing collections...");
  await Member.deleteMany({});
  await Seat.deleteMany({});
  await AttendanceLog.deleteMany({});
  await Transaction.deleteMany({});
  await Expense.deleteMany({});
  await Subscription.deleteMany({});
  await User.deleteMany({});

  console.log("Seeding default Admin User...");
  const adminPasswordHash = await bcrypt.hash("Test@123", 10);
  const defaultAdmin = new User({
    name: "Mani (Owner)",
    email: "mani@gmail.com",
    passwordHash: adminPasswordHash,
    role: "admin"
  });
  await defaultAdmin.save();

  console.log("Seeding Members...");
  await Member.insertMany(defaultMembers);

  console.log("Seeding Seats...");
  const seats = Array.from({ length: 60 }, (_, idx) => {
    const id = idx + 1;
    let status: "Available" | "Occupied" | "Reserved" | "Maintenance" | "Away" = "Available";
    let occupiedBy = "";
    let occupiedByEmail = "";
    let checkInTime = "";
    let assignedShift: "Morning" | "Evening" | "Night" | "Full Day" | undefined = undefined;

    const category = 
      id <= 30 ? "General Desk" :
      id <= 50 ? "Premium Desk" : "VIP Cabin";

    if (id === 4) {
      status = "Occupied";
      occupiedBy = "Maniraj";
      occupiedByEmail = "mraj14558@gmail.com";
      checkInTime = "09:15 AM";
      assignedShift = "Full Day";
    } else if (id === 15) {
      status = "Occupied";
      occupiedBy = "Ankit";
      occupiedByEmail = "jehenealfaaz28@gmail.com";
      checkInTime = "10:00 AM";
      assignedShift = "Full Day";
    } else if ([5, 12, 28, 45, 59].includes(id)) {
      status = "Reserved";
    } else if ([17, 33, 48].includes(id)) {
      status = "Maintenance";
    }

    return { id, status, occupiedBy, occupiedByEmail, checkInTime, category, assignedShift };
  });
  await Seat.insertMany(seats);

  console.log("Seeding Attendance Logs...");
  await AttendanceLog.insertMany(initialAttendanceLogs);

  console.log("Seeding Transactions...");
  await Transaction.insertMany(initialTransactions);

  console.log("Seeding Expenses...");
  await Expense.insertMany(initialExpenses);

  console.log("Seeding Subscriptions...");
  await Subscription.insertMany(initialSubscriptions);

  console.log("Database seeded successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Error during database seed:", err);
  process.exit(1);
});
