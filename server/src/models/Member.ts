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
}

const MemberSchema = new Schema<IMember>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: "-" },
  address: { type: String, default: "-" },
  joined: { type: String, required: true },
  lastLogin: { type: String, default: "N/A" },
  by: { type: String, default: "App" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  initial: { type: String, required: true },
  color: { type: String, required: true },
});

export const Member = model<IMember>("Member", MemberSchema);
