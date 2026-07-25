const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock In-Memory Database
const mockUser = {
  id: 'usr_8842',
  name: 'Mani Kumar',
  email: 'mani@gmail.com',
  phone: '+91 98765 43210',
  membershipId: 'ETH-2026-8842',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
  planName: 'Prime Dedicated Bay (AC)',
  validTill: '2026-12-31',
  daysRemaining: 158,
  currentSeat: 'A-12',
  floor: 'First Floor (Silent Zone)',
  shift: 'Full Day (07:00 AM - 11:00 PM)',
  joinedDate: '2026-01-15'
};

const mockAttendance = [
  { id: '1', date: '2026-07-25', checkIn: '10:39 PM', checkOut: null, durationHours: 0.1, status: 'in_progress', seatNumber: 'A-12' },
  { id: '2', date: '2026-07-25', checkIn: '08:30 AM', checkOut: '10:39 PM', durationHours: 6.5, status: 'completed', seatNumber: 'A-12' },
  { id: '3', date: '2026-07-24', checkIn: '08:15 AM', checkOut: '09:00 PM', durationHours: 12.8, status: 'completed', seatNumber: 'A-12' },
  { id: '4', date: '2026-07-23', checkIn: '09:00 AM', checkOut: '08:30 PM', durationHours: 11.5, status: 'completed', seatNumber: 'A-12' },
  { id: '5', date: '2026-07-22', checkIn: '08:45 AM', checkOut: '09:15 PM', durationHours: 12.5, status: 'completed', seatNumber: 'A-12' }
];

const mockNotices = [
  { id: '1', title: 'Library Maintenance & AC Servicing', date: '2026-07-24', category: 'Maintenance', content: 'AC servicing scheduled for 2nd Floor on Sunday between 06:00 AM - 09:00 AM. 1st Floor silent zone will remain operational.', urgent: false },
  { id: '2', title: 'Upcoming Mock Test Series (UPSC / BPSC)', date: '2026-07-22', category: 'Exam Prep', content: 'Free full-length mock exam answer sheets available at reception for all registered members.', urgent: true }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mitra Backend API Server is running!' });
});

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Email/Phone and Password are required' });
  }
  res.json({
    message: 'Login successful',
    token: 'jwt_token_mitra_8842',
    user: mockUser
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { fullName, emailOrPhone, password } = req.body;
  if (!fullName || !emailOrPhone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  res.json({
    message: 'Account created successfully',
    token: 'jwt_token_mitra_new',
    user: { ...mockUser, name: fullName, email: emailOrPhone }
  });
});

// User Profile Route
app.get('/api/user/profile', (req, res) => {
  res.json(mockUser);
});

// Attendance Routes
app.get('/api/attendance', (req, res) => {
  res.json(mockAttendance);
});

// Notices Route
app.get('/api/notices', (req, res) => {
  res.json(mockNotices);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Mitra Backend Server running on http://localhost:${PORT}`);
});
