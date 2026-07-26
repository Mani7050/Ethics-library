import { Schema, model, Document } from "mongoose";

export interface IPlan extends Document {
  id: string;
  name: string;
  price: string;
  duration: string;
  type: string;
  desc: string;
  iconName?: string;
  color?: string;
}

const PlanSchema = new Schema<IPlan>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  price: { type: String, required: true },
  duration: { type: String, required: true, default: "Monthly" },
  type: { type: String, required: true, default: "Standard" },
  desc: { type: String, required: true },
  iconName: { type: String, default: "Award" },
  color: { type: String, default: "border-zinc-200 dark:border-zinc-800" },
}, { timestamps: true });

export const Plan = model<IPlan>("Plan", PlanSchema);
