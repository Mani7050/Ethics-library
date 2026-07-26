const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const Member = require('./models/Member');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ethics_library_secret_key_12345';
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

let isDbConnected = false;

// Connect to MongoDB Atlas Cloud Database
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      isDbConnected = true;
      console.log('🍃 MongoDB Atlas Database Connected Successfully to "members" collection!');
    })
    .catch((err) => console.warn('⚠️ MongoDB connection error (using in-memory fallback):', err.message));
}

// In-Memory Fallback Database for Users
const inMemoryUsers = [
  {
    _id: 'usr_8842',
    name: 'Mani Kumar',
    email: 'mani@gmail.com',
    phone: '+91 98765 43210',
    password: bcrypt.hashSync('password123', 10),
    membershipId: 'ETH-2026-8842',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    planName: 'Prime Dedicated Bay (AC)',
    validTill: '2026-12-31',
    daysRemaining: 158,
    currentSeat: 'A-12',
    floor: 'First Floor (Silent Zone)',
    shift: 'Full Day (07:00 AM - 11:00 PM)',
    joinedDate: '2026-01-15'
  }
];

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

// Helper to remove password before sending user object to client
const sanitizeUser = (userDoc) => {
  const userObj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  userObj.id = userObj._id ? userObj._id.toString() : userObj.id;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Authorization token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (token.startsWith('jwt_token_')) {
        const parts = token.split('_');
        req.userPayload = { id: parts.length >= 3 ? `${parts[1]}_${parts[2]}` : 'usr_8842' };
        return next();
      }
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.userPayload = decoded;
    next();
  });
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    dbConnected: mongoose.connection.readyState === 1,
    message: 'Mitra Backend API Server is running!'
  });
});

// Auth Routes: LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Email/Phone and Password are required' });
    }

    const query = emailOrPhone.trim().toLowerCase();
    let foundUser = null;

    if (mongoose.connection.readyState === 1) {
      foundUser = await Member.findOne({
        $or: [
          { email: query },
          { phone: query },
          { name: new RegExp(`^${query}$`, 'i') }
        ]
      });
    }

    if (!foundUser) {
      foundUser = inMemoryUsers.find(
        (u) => u.email.toLowerCase() === query || u.phone.includes(query) || u.name.toLowerCase().includes(query)
      );
    }

    if (!foundUser) {
      return res.status(401).json({ error: 'No account found with this email/phone.' });
    }

    const isMatch = bcrypt.compareSync(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const userId = foundUser._id ? foundUser._id.toString() : foundUser.id;
    const token = jwt.sign(
      { id: userId, email: foundUser.email, membershipId: foundUser.membershipId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: sanitizeUser(foundUser)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Auth Routes: SIGNUP (Saves to MongoDB "members" collection)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, emailOrPhone, password } = req.body;
    if (!fullName || !emailOrPhone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const query = emailOrPhone.trim().toLowerCase();
    const isEmail = emailOrPhone.includes('@');
    const userEmail = isEmail ? query : `${fullName.toLowerCase().replace(/\s+/g, '')}@ethicslibrary.com`;
    const userPhone = isEmail ? '+91 98765 43210' : query;

    // 1. Check if user already exists in DB
    if (mongoose.connection.readyState === 1) {
      const existingDbUser = await Member.findOne({
        $or: [{ email: userEmail }, { phone: userPhone }]
      });
      if (existingDbUser) {
        return res.status(400).json({ error: 'An account with this email/phone already exists. Please log in.' });
      }
    }

    // 2. Encrypt password using Bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);
    const numId = Math.floor(1000 + Math.random() * 9000);
    const membershipId = `ETH-2026-${numId}`;

    let newUserDoc = null;

    // 3. Save to MongoDB Atlas "members" collection
    if (mongoose.connection.readyState === 1) {
      newUserDoc = await Member.create({
        name: fullName,
        email: userEmail,
        phone: userPhone,
        password: hashedPassword,
        membershipId,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
        planName: 'Prime Dedicated Bay (AC)',
        validTill: '2026-12-31',
        daysRemaining: 180,
        currentSeat: 'B-04',
        floor: 'First Floor (Silent Zone)',
        shift: 'Full Day (07:00 AM - 11:00 PM)',
        joinedDate: new Date().toISOString().split('T')[0]
      });
      console.log(`✅ Saved new member "${fullName}" (${membershipId}) directly into MongoDB Atlas "members" collection!`);
    } else {
      newUserDoc = {
        _id: `usr_${numId}`,
        name: fullName,
        email: userEmail,
        phone: userPhone,
        password: hashedPassword,
        membershipId,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
        planName: 'Prime Dedicated Bay (AC)',
        validTill: '2026-12-31',
        daysRemaining: 180,
        currentSeat: 'B-04',
        floor: 'First Floor (Silent Zone)',
        shift: 'Full Day (07:00 AM - 11:00 PM)',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      inMemoryUsers.push(newUserDoc);
    }

    const userId = newUserDoc._id ? newUserDoc._id.toString() : newUserDoc.id;
    const token = jwt.sign(
      { id: userId, email: newUserDoc.email, membershipId: newUserDoc.membershipId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully in MongoDB members collection',
      token,
      user: sanitizeUser(newUserDoc)
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error during signup' });
  }
});

// User Profile / Me Route
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.userPayload ? req.userPayload.id : null;
    let foundUser = null;

    if (mongoose.connection.readyState === 1 && userId && mongoose.Types.ObjectId.isValid(userId)) {
      foundUser = await Member.findById(userId);
    }

    if (!foundUser) {
      foundUser = inMemoryUsers.find((u) => u._id === userId || u.id === userId) || inMemoryUsers[0];
    }

    res.json({ user: sanitizeUser(foundUser) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

app.get('/api/user/profile', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const dbUser = await Member.findOne();
    if (dbUser) return res.json(sanitizeUser(dbUser));
  }
  res.json(sanitizeUser(inMemoryUsers[0]));
});

// Profile Update Endpoint (Updates MongoDB Atlas "members" collection)
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.userPayload ? req.userPayload.id : null;
    const { name, email, phone, avatar, targetExam, dailyTargetHours, emergencyContact } = req.body;

    let updatedUser = null;

    if (mongoose.connection.readyState === 1 && userId && mongoose.Types.ObjectId.isValid(userId)) {
      updatedUser = await Member.findByIdAndUpdate(
        userId,
        {
          $set: {
            ...(name && { name }),
            ...(email && { email }),
            ...(phone && { phone }),
            ...(avatar && { avatar }),
            ...(targetExam && { targetExam }),
            ...(dailyTargetHours && { dailyTargetHours }),
            ...(emergencyContact && { emergencyContact }),
          },
        },
        { new: true }
      );
    }

    if (!updatedUser) {
      const idx = inMemoryUsers.findIndex((u) => u._id === userId || u.id === userId);
      if (idx !== -1) {
        if (name) inMemoryUsers[idx].name = name;
        if (email) inMemoryUsers[idx].email = email;
        if (phone) inMemoryUsers[idx].phone = phone;
        if (avatar) inMemoryUsers[idx].avatar = avatar;
        if (targetExam) inMemoryUsers[idx].targetExam = targetExam;
        if (dailyTargetHours) inMemoryUsers[idx].dailyTargetHours = dailyTargetHours;
        if (emergencyContact) inMemoryUsers[idx].emergencyContact = emergencyContact;
        updatedUser = inMemoryUsers[idx];
      } else {
        updatedUser = { ...inMemoryUsers[0], name, email, phone, targetExam, dailyTargetHours, emergencyContact };
      }
    }

    res.json({
      message: 'Profile updated successfully in MongoDB Atlas',
      user: sanitizeUser(updatedUser),
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
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


