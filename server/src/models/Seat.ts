import { Schema, model, Document } from "mongoose";

export interface ISeat extends Document {
  id: number;
  status: "Available" | "Occupied" | "Reserved" | "Maintenance" | "Away";
  occupiedBy: string;
  occupiedByEmail: string;
  checkInTime?: string;
  maintenanceDesc?: string;
  category: string;
  assignedShift?: "Morning" | "Evening" | "Night" | "Full Day";
  awaySince?: string;
}

const SeatSchema = new Schema<ISeat>({
  id: { type: Number, required: true, unique: true },
  status: { 
    type: String, 
    enum: ["Available", "Occupied", "Reserved", "Maintenance", "Away"], 
    default: "Available" 
  },
  occupiedBy: { type: String, default: "" },
  occupiedByEmail: { type: String, default: "" },
  checkInTime: { type: String },
  maintenanceDesc: { type: String },
  category: { type: String, required: true, default: "General Desk" },
  assignedShift: { 
    type: String, 
    enum: ["Morning", "Evening", "Night", "Full Day", null]
  },
  awaySince: { type: String },
});

export const Seat = model<ISeat>("Seat", SeatSchema);
