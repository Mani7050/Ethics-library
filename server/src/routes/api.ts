import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Member } from "../models/Member";
import { Seat } from "../models/Seat";
import { AttendanceLog } from "../models/AttendanceLog";
import { Transaction } from "../models/Transaction";
import { Expense } from "../models/Expense";
import { Subscription } from "../models/Subscription";
import { User } from "../models/User";

const router = Router();

// Helper to catch async errors
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// JWT Authentication Guard Middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Allow OPTIONS preflight requests to bypass authorization
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Access token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ethics_library_secret_key_12345") as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Forbidden: Session token has expired or is invalid" });
  }
};

// ==========================================
// 0. AUTH ROUTES
// ==========================================

// POST /auth/register
router.post("/auth/register", asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  // Prevent bcrypt CPU exhaustion (Long Password DoS) and protect database
  if (password.length > 72) {
    return res.status(400).json({ error: "Password cannot be longer than 72 characters" });
  }

  if (email.length > 100 || name.length > 100) {
    return res.status(400).json({ error: "Email and name cannot exceed 100 characters" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ error: "Email is already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "admin"
  });

  await newUser.save();

  const token = jwt.sign(
    { userId: newUser._id, email: newUser.email, role: newUser.role },
    process.env.JWT_SECRET || "ethics_library_secret_key_12345",
    { expiresIn: "7d" }
  );

  res.status(201).json({
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
}));

// POST /auth/login
router.post("/auth/login", asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Prevent bcrypt CPU exhaustion (Long Password DoS)
  if (password.length > 72) {
    return res.status(400).json({ error: "Password cannot be longer than 72 characters" });
  }

  if (email.length > 100) {
    return res.status(400).json({ error: "Email cannot exceed 100 characters" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "ethics_library_secret_key_12345",
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));

// GET /auth/me (Verify session)
router.get("/auth/me", asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ethics_library_secret_key_12345") as any;
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}));

// Protect all routes below with JWT authorization
router.use(requireAuth);

// ==========================================
// 1. MEMBER ROUTES
// ==========================================

// GET /members
router.get("/members", asyncHandler(async (req: Request, res: Response) => {
  const members = await Member.find().sort({ joined: -1 });
  res.json(members);
}));

// POST /members
router.post("/members", asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, address } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const existingMember = await Member.findOne({ email: email.toLowerCase() });
  if (existingMember) {
    return res.status(400).json({ error: `Member with email ${email} already exists` });
  }

  const initialVal = name
    .split(" ")
    .map((n: string) => n.charAt(0))
    .join("")
    .toUpperCase();

  const colors = [
    "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400",
    "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
    "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  ];
  const membersCount = await Member.countDocuments();
  const randomColor = colors[membersCount % colors.length];

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" };
  const formattedDate = new Date().toLocaleDateString("en-US", options);

  const newMember = new Member({
    name,
    email: email.toLowerCase(),
    phone: phone || "-",
    address: address || "-",
    joined: formattedDate,
    lastLogin: "N/A",
    by: "App",
    status: "Active",
    initial: initialVal || "U",
    color: randomColor,
  });

  await newMember.save();
  res.status(201).json(newMember);
}));

// PATCH /members/:email
router.patch("/members/:email", asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;
  const updatedData = req.body;

  const member = await Member.findOne({ email: email.toLowerCase() });
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  if (updatedData.name) {
    const initialVal = updatedData.name
      .split(" ")
      .map((n: string) => n.charAt(0))
      .join("")
      .toUpperCase();
    member.initial = initialVal || "U";
    member.name = updatedData.name;
  }

  if (updatedData.phone !== undefined) member.phone = updatedData.phone;
  if (updatedData.address !== undefined) member.address = updatedData.address;
  if (updatedData.status !== undefined) member.status = updatedData.status;

  await member.save();
  res.json(member);
}));

// PATCH /members/:email/toggle
router.patch("/members/:email/toggle", asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;

  const member = await Member.findOne({ email: email.toLowerCase() });
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  member.status = member.status === "Active" ? "Inactive" : "Active";
  await member.save();
  res.json(member);
}));

// DELETE /members/:email
router.delete("/members/:email", asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;

  const result = await Member.deleteOne({ email: email.toLowerCase() });
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Member not found" });
  }

  res.json({ message: "Member deleted successfully" });
}));


// ==========================================
// 2. SEAT ROUTES
// ==========================================

// GET /seats
router.get("/seats", asyncHandler(async (req: Request, res: Response) => {
  const seats = await Seat.find().sort({ id: 1 });
  res.json(seats);
}));

// POST /seats/assign
router.post("/seats/assign", asyncHandler(async (req: Request, res: Response) => {
  const { seatId, memberEmail, customTime, shiftName } = req.body;

  if (!seatId || !memberEmail) {
    return res.status(400).json({ error: "Seat ID and member email are required" });
  }

  const member = await Member.findOne({ email: memberEmail.toLowerCase() });
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  const seat = await Seat.findOne({ id: seatId });
  if (!seat) {
    return res.status(404).json({ error: `Seat #${seatId} not found` });
  }

  if (seat.status !== "Available") {
    return res.status(400).json({ error: `Seat #${seatId} is currently ${seat.status}` });
  }

  const currentOccupied = await Seat.findOne({ occupiedByEmail: memberEmail.toLowerCase() });
  if (currentOccupied) {
    return res.status(400).json({ 
      error: `${member.name} is already sitting at Seat #${currentOccupied.id}` 
    });
  }

  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
  const formattedTime = customTime || new Date().toLocaleTimeString("en-US", timeOptions);

  // Update Seat
  seat.status = "Occupied";
  seat.occupiedBy = member.name;
  seat.occupiedByEmail = memberEmail.toLowerCase();
  seat.checkInTime = formattedTime;
  seat.assignedShift = shiftName || "Full Day";
  await seat.save();

  // Create Log
  const dateOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const formattedDate = new Date().toLocaleDateString("en-US", dateOptions);

  const newLog = new AttendanceLog({
    id: `log-${Date.now()}`,
    name: member.name,
    email: memberEmail.toLowerCase(),
    seat: `Desk ${seatId < 10 ? "0" + seatId : seatId}${shiftName ? ` (${shiftName})` : ""}`,
    date: formattedDate,
    checkIn: formattedTime,
    checkOut: "--",
    hours: "Ongoing",
    status: "Inside",
    initial: member.initial,
    color: member.color,
  });
  await newLog.save();

  // Update Member's lastLogin
  const loginOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" };
  const formattedLogin = new Date().toLocaleDateString("en-US", loginOptions);
  member.lastLogin = formattedLogin;
  await member.save();

  res.json({ seat, log: newLog });
}));

// POST /seats/release
router.post("/seats/release", asyncHandler(async (req: Request, res: Response) => {
  const { seatId } = req.body;

  if (!seatId) {
    return res.status(400).json({ error: "Seat ID is required" });
  }

  const seat = await Seat.findOne({ id: seatId });
  if (!seat) {
    return res.status(404).json({ error: `Seat #${seatId} not found` });
  }

  if (seat.status !== "Occupied" && seat.status !== "Away") {
    return res.status(400).json({ error: `Seat #${seatId} is not occupied` });
  }

  const occupantEmail = seat.occupiedByEmail;

  // Reset seat status
  seat.status = "Available";
  seat.occupiedBy = "";
  seat.occupiedByEmail = "";
  seat.checkInTime = undefined;
  seat.assignedShift = undefined;
  seat.awaySince = undefined;
  await seat.save();

  // Update attendance logs
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
  const formattedTime = new Date().toLocaleTimeString("en-US", timeOptions);

  const deskStr = `Desk ${seatId < 10 ? "0" + seatId : seatId}`;
  
  // Find ongoing logs for this user at this desk and update them
  await AttendanceLog.updateMany(
    { 
      email: occupantEmail, 
      status: { $in: ["Inside", "Away"] }, 
      seat: { $regex: `^${deskStr}` } 
    },
    { 
      $set: { 
        checkOut: formattedTime, 
        hours: "Logged Out", 
        status: "Checked Out" 
      } 
    }
  );

  res.json({ seat });
}));

// POST /seats/transfer
router.post("/seats/transfer", asyncHandler(async (req: Request, res: Response) => {
  const { fromSeatId, toSeatId } = req.body;

  if (!fromSeatId || !toSeatId) {
    return res.status(400).json({ error: "Origin and Target seat IDs are required" });
  }

  const fromSeat = await Seat.findOne({ id: fromSeatId });
  const toSeat = await Seat.findOne({ id: toSeatId });

  if (!fromSeat || fromSeat.status !== "Occupied") {
    return res.status(400).json({ error: `Origin Seat #${fromSeatId} is not occupied` });
  }
  if (!toSeat || toSeat.status !== "Available") {
    return res.status(400).json({ error: `Target Seat #${toSeatId} is not available` });
  }

  const { occupiedBy, occupiedByEmail, checkInTime, assignedShift } = fromSeat;

  // Move occupant details to new seat
  toSeat.status = "Occupied";
  toSeat.occupiedBy = occupiedBy;
  toSeat.occupiedByEmail = occupiedByEmail;
  toSeat.checkInTime = checkInTime;
  toSeat.assignedShift = assignedShift;
  await toSeat.save();

  // Reset origin seat
  fromSeat.status = "Available";
  fromSeat.occupiedBy = "";
  fromSeat.occupiedByEmail = "";
  fromSeat.checkInTime = undefined;
  fromSeat.assignedShift = undefined;
  fromSeat.awaySince = undefined;
  await fromSeat.save();

  // Update ongoing attendance log's seat label
  const oldDeskStr = `Desk ${fromSeatId < 10 ? "0" + fromSeatId : fromSeatId}`;
  const newDeskStr = `Desk ${toSeatId < 10 ? "0" + toSeatId : toSeatId}${assignedShift ? ` (${assignedShift})` : ""}`;

  await AttendanceLog.updateOne(
    { 
      email: occupiedByEmail, 
      status: "Inside", 
      seat: { $regex: `^${oldDeskStr}` } 
    },
    { $set: { seat: newDeskStr } }
  );

  res.json({ fromSeat, toSeat });
}));

// PATCH /seats/:id/status
router.patch("/seats/:id/status", asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { status, desc } = req.body;

  const seat = await Seat.findOne({ id });
  if (!seat) {
    return res.status(404).json({ error: `Seat #${id} not found` });
  }

  seat.status = status;
  if (desc !== undefined) seat.maintenanceDesc = desc;

  // If status is changed away from occupied/away, clear occupant details
  if (status !== "Occupied" && status !== "Away") {
    seat.occupiedBy = "";
    seat.occupiedByEmail = "";
    seat.checkInTime = undefined;
    seat.assignedShift = undefined;
    seat.awaySince = undefined;
  }
  await seat.save();

  res.json(seat);
}));

// POST /seats/:id/away
router.post("/seats/:id/away", asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  const seat = await Seat.findOne({ id });
  if (!seat) {
    return res.status(404).json({ error: `Seat #${id} not found` });
  }

  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
  const formattedTime = new Date().toLocaleTimeString("en-US", timeOptions);

  if (seat.status === "Occupied") {
    seat.status = "Away";
    seat.awaySince = formattedTime;
    await seat.save();

    // Update attendance log to Away
    const seatNumStr = id < 10 ? "0" + id : id.toString();
    await AttendanceLog.updateMany(
      { seat: { $regex: `^Desk ${seatNumStr}` }, status: "Inside" },
      { $set: { status: "Away" } }
    );
  } else if (seat.status === "Away") {
    seat.status = "Occupied";
    seat.awaySince = undefined;
    await seat.save();

    // Update attendance log to Inside
    const seatNumStr = id < 10 ? "0" + id : id.toString();
    await AttendanceLog.updateMany(
      { seat: { $regex: `^Desk ${seatNumStr}` }, status: "Away" },
      { $set: { status: "Inside" } }
    );
  } else {
    return res.status(400).json({ error: `Seat #${id} is not occupied or away` });
  }

  res.json(seat);
}));

// POST /seats/add
router.post("/seats/add", asyncHandler(async (req: Request, res: Response) => {
  const { category, customSeatNumber } = req.body;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  let seatId: number;

  if (customSeatNumber && !isNaN(Number(customSeatNumber))) {
    const desiredId = Number(customSeatNumber);
    if (desiredId <= 0) {
      return res.status(400).json({ error: "Seat number must be greater than 0" });
    }
    const existing = await Seat.findOne({ id: desiredId });
    if (existing) {
      return res.status(400).json({ error: `Seat Desk #${desiredId} already exists.` });
    }
    seatId = desiredId;
  } else {
    const maxSeat = await Seat.findOne().sort({ id: -1 });
    seatId = maxSeat ? maxSeat.id + 1 : 1;
  }

  const newSeat = new Seat({
    id: seatId,
    status: "Available",
    occupiedBy: "",
    occupiedByEmail: "",
    category,
  });

  await newSeat.save();
  res.status(201).json(newSeat);
}));

// PATCH /seats/:id/timings
router.patch("/seats/:id/timings", asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { checkInTime, assignedShift } = req.body;

  const seat = await Seat.findOne({ id });
  if (!seat) {
    return res.status(404).json({ error: `Seat #${id} not found` });
  }

  seat.checkInTime = checkInTime;
  seat.assignedShift = assignedShift;
  await seat.save();

  // Update ongoing attendance log
  const seatNumStr = id < 10 ? "0" + id : id.toString();
  const shiftStr = assignedShift ? ` (${assignedShift})` : "";
  const newSeatLabel = `Desk ${seatNumStr}${shiftStr}`;

  await AttendanceLog.updateOne(
    { 
      seat: { $regex: `^Desk ${seatNumStr}` }, 
      status: { $in: ["Inside", "Away"] } 
    },
    { 
      $set: { 
        checkIn: checkInTime,
        seat: newSeatLabel 
      } 
    }
  );

  res.json(seat);
}));

// PATCH /seats/category/rename
router.patch("/seats/category/rename", asyncHandler(async (req: Request, res: Response) => {
  const { oldName, newName } = req.body;

  if (!oldName || !newName) {
    return res.status(400).json({ error: "Old name and New name are required" });
  }

  await Seat.updateMany({ category: oldName }, { $set: { category: newName } });
  res.json({ message: `Successfully renamed category to ${newName}` });
}));

// PATCH /seats/category/delete
router.patch("/seats/category/delete", asyncHandler(async (req: Request, res: Response) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ error: "Category name is required" });
  }

  await Seat.updateMany({ category: categoryName }, { $set: { category: "General Desk" } });
  res.json({ message: `Successfully deleted category ${categoryName} and reset seats to General Desk` });
}));


// ==========================================
// 3. ATTENDANCE ROUTES
// ==========================================

// GET /attendance
router.get("/attendance", asyncHandler(async (req: Request, res: Response) => {
  const logs = await AttendanceLog.find().sort({ date: -1, checkIn: -1 });
  res.json(logs);
}));

// POST /attendance/check-in
// Uses same logic as seats assign
router.post("/attendance/check-in", asyncHandler(async (req: Request, res: Response) => {
  const { memberEmail, seatId } = req.body;
  // Redirect to seat assignment
  req.url = "/seats/assign";
  (router as any).handle(req, res, () => {});
}));

// POST /attendance/check-out
router.post("/attendance/check-out", asyncHandler(async (req: Request, res: Response) => {
  const { logId } = req.body;

  if (!logId) {
    return res.status(400).json({ error: "Log ID is required" });
  }

  const log = await AttendanceLog.findOne({ id: logId });
  if (!log) {
    return res.status(404).json({ error: "Attendance log not found" });
  }

  if (log.status === "Checked Out") {
    return res.status(400).json({ error: "Member is already checked out" });
  }

  const seatMatch = log.seat.match(/\d+/);
  if (seatMatch) {
    const seatId = parseInt(seatMatch[0], 10);
    
    // Call releaseSeat logic internally or redirect
    const seat = await Seat.findOne({ id: seatId });
    if (seat && (seat.status === "Occupied" || seat.status === "Away")) {
      seat.status = "Available";
      seat.occupiedBy = "";
      seat.occupiedByEmail = "";
      seat.checkInTime = undefined;
      seat.assignedShift = undefined;
      seat.awaySince = undefined;
      await seat.save();
    }
  }

  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
  const formattedTime = new Date().toLocaleTimeString("en-US", timeOptions);

  log.checkOut = formattedTime;
  log.hours = "Logged Out";
  log.status = "Checked Out";
  await log.save();

  res.json(log);
}));


// ==========================================
// 4. TRANSACTION / FINANCE ROUTES
// ==========================================

// GET /transactions
router.get("/transactions", asyncHandler(async (req: Request, res: Response) => {
  const txs = await Transaction.find().sort({ id: -1 });
  res.json(txs);
}));

// POST /transactions
router.post("/transactions", asyncHandler(async (req: Request, res: Response) => {
  const { memberEmail, planName, amount, method } = req.body;

  if (!memberEmail || !planName || amount === undefined || !method) {
    return res.status(400).json({ error: "Email, plan, amount, and payment method are required" });
  }

  const member = await Member.findOne({ email: memberEmail.toLowerCase() });
  const name = member ? member.name : "Unknown Reader";
  const initial = member ? member.initial : "U";
  const color = member ? member.color : "bg-zinc-100 text-zinc-700";

  const dateOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" };
  const formattedDate = new Date().toLocaleDateString("en-US", dateOptions);

  const lastTx = await Transaction.findOne().sort({ id: -1 });
  const nextId = lastTx ? lastTx.id + 1 : 101;

  const newTx = new Transaction({
    id: nextId,
    name,
    email: memberEmail.toLowerCase(),
    plan: planName,
    amount: `₹${amount.toLocaleString()}`,
    method,
    status: "Paid",
    date: formattedDate,
    initial,
    color,
  });

  await newTx.save();
  res.status(201).json(newTx);
}));


// ==========================================
// 5. EXPENSE ROUTES
// ==========================================

// GET /expenses
router.get("/expenses", asyncHandler(async (req: Request, res: Response) => {
  const exps = await Expense.find().sort({ id: -1 });
  res.json(exps);
}));

// POST /expenses
router.post("/expenses", asyncHandler(async (req: Request, res: Response) => {
  const { title, category, amount } = req.body;

  if (!title || !category || amount === undefined) {
    return res.status(400).json({ error: "Title, category, and amount are required" });
  }

  const initialVal = category.charAt(0).toUpperCase();

  const colors = {
    Rent: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    Utility: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    Salary: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
    Maintenance: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  };
  const color = colors[category as keyof typeof colors] || "bg-zinc-100 text-zinc-700";

  const dateOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const formattedDate = new Date().toLocaleDateString("en-US", dateOptions);

  const lastExp = await Expense.findOne().sort({ id: -1 });
  const nextId = lastExp ? lastExp.id + 1 : 1;

  const newExp = new Expense({
    id: nextId,
    title,
    category,
    amount: `₹${amount.toLocaleString()}`,
    status: "Paid",
    date: formattedDate,
    initial: initialVal,
    color,
  });

  await newExp.save();
  res.status(201).json(newExp);
}));


// ==========================================
// 6. SUBSCRIPTION ROUTES
// ==========================================

// GET /subscriptions
router.get("/subscriptions", asyncHandler(async (req: Request, res: Response) => {
  const subs = await Subscription.find().sort({ end: -1 });
  res.json(subs);
}));

// POST /subscriptions
router.post("/subscriptions", asyncHandler(async (req: Request, res: Response) => {
  const { memberEmail, planName } = req.body;

  if (!memberEmail || !planName) {
    return res.status(400).json({ error: "Email and Plan Name are required" });
  }

  const member = await Member.findOne({ email: memberEmail.toLowerCase() });
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  const planPricesMap: Record<string, number> = {
    "General Library Access": 800,
    "Premium Reading Desk": 1500,
    "VIP Quiet Cabin": 3000,
  };
  const priceVal = planPricesMap[planName] || 800;

  const startOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(startDate.getDate() + 30);

  const formattedStart = startDate.toLocaleDateString("en-US", startOptions);
  const formattedEnd = expiryDate.toLocaleDateString("en-US", startOptions);

  const newSub = new Subscription({
    id: `sub-${Date.now()}`,
    name: member.name,
    email: memberEmail.toLowerCase(),
    plan: planName,
    price: `₹${priceVal.toLocaleString()}`,
    start: formattedStart,
    end: formattedEnd,
    status: "Active",
    initial: member.initial,
    color: member.color,
  });

  await newSub.save();

  // Create Fee transaction automatically
  const lastTx = await Transaction.findOne().sort({ id: -1 });
  const nextTxId = lastTx ? lastTx.id + 1 : 101;

  const dateOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" };
  const formattedDate = new Date().toLocaleDateString("en-US", dateOptions);

  const newTx = new Transaction({
    id: nextTxId,
    name: member.name,
    email: memberEmail.toLowerCase(),
    plan: planName,
    amount: `₹${priceVal.toLocaleString()}`,
    method: "UPI (GPay)",
    status: "Paid",
    date: formattedDate,
    initial: member.initial,
    color: member.color,
  });
  await newTx.save();

  res.status(201).json({ subscription: newSub, transaction: newTx });
}));

// PATCH /subscriptions/:id/toggle
router.patch("/subscriptions/:id/toggle", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const sub = await Subscription.findOne({ id });
  if (!sub) {
    return res.status(404).json({ error: "Subscription not found" });
  }

  sub.status = sub.status === "Active" ? "Expired" : "Active";
  await sub.save();
  res.json(sub);
}));

// DELETE /subscriptions/:id
router.delete("/subscriptions/:id", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await Subscription.deleteOne({ id });
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Subscription not found" });
  }

  res.json({ message: "Subscription deleted successfully" });
}));

export default router;
