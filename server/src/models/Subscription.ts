import { Schema, model, Document } from "mongoose";

export interface ISubscription extends Document {
  id: string;
  name: string;
  email: string;
  plan: string;
  price: string;
  start: string;
  end: string;
  status: "Active" | "Expired";
  initial: string;
  color: string;
}

const SubscriptionSchema = new Schema<ISubscription>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  plan: { type: String, required: true },
  price: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  status: { type: String, enum: ["Active", "Expired"], default: "Active" },
  initial: { type: String, required: true },
  color: { type: String, required: true },
});

export const Subscription = model<ISubscription>("Subscription", SubscriptionSchema);
