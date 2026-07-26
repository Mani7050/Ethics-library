import { Schema, model, Document } from "mongoose";

export interface IMember extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  joined: string;
  lastLogin: string;
  by: string;
  status: "Active" | "Inactive";
  initial: string;
  color: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const MemberSchema = new Schema<IMember>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: "-" },
  address: { type: String, default: "-" },
  joined: { type: String, default: () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
  lastLogin: { type: String, default: "N/A" },
  by: { type: String, default: "App" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  initial: { type: String, default: "U" },
  color: { type: String, default: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
}, { strict: false });

export const Member = model<IMember>("Member", MemberSchema);
