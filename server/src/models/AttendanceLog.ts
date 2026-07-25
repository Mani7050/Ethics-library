import { Schema, model, Document } from "mongoose";

export interface IAttendanceLog extends Document {
  id: string;
  name: string;
  email: string;
  seat: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  status: "Inside" | "Checked Out" | "Away";
  initial: string;
  color: string;
}

const AttendanceLogSchema = new Schema<IAttendanceLog>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  seat: { type: String, required: true },
  date: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, default: "--" },
  hours: { type: String, default: "Ongoing" },
  status: { 
    type: String, 
    enum: ["Inside", "Checked Out", "Away"], 
    default: "Inside" 
  },
  initial: { type: String, required: true },
  color: { type: String, required: true },
});

export const AttendanceLog = model<IAttendanceLog>("AttendanceLog", AttendanceLogSchema);
