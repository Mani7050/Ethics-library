const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
    membershipId: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    },
    planName: {
      type: String,
      default: 'Prime Dedicated Bay (AC)',
    },
    validTill: {
      type: String,
      default: '2026-12-31',
    },
    daysRemaining: {
      type: Number,
      default: 180,
    },
    currentSeat: {
      type: String,
      default: 'B-04',
    },
    floor: {
      type: String,
      default: 'First Floor (Silent Zone)',
    },
    shift: {
      type: String,
      default: 'Full Day (07:00 AM - 11:00 PM)',
    },
    status: {
      type: String,
      default: 'Active',
    },
    targetExam: {
      type: String,
      default: 'UPSC Civil Services 2026',
    },
    dailyTargetHours: {
      type: String,
      default: '10',
    },
    emergencyContact: {
      type: String,
      default: '+91 98765 00000',
    },
    joinedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    joined: {
      type: String,
      default: () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    },
    lastLogin: {
      type: String,
      default: 'N/A',
    },
    by: {
      type: String,
      default: 'App',
    },
    initial: {
      type: String,
      default: 'U',
    },
    color: {
      type: String,
      default: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    },
    address: {
      type: String,
      default: '-',
    },
  },
  {
    timestamps: true,
    strict: false,
    collection: 'members', // Explicitly saves to 'members' collection in MongoDB Atlas!
  }
);

module.exports = mongoose.model('Member', memberSchema);
