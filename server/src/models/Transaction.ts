import { Schema, model, Document } from "mongoose";

export interface ITransaction extends Document {
  id: number;
  name: string;
  email: string;
  plan: string;
  amount: string;
  method: string;
  status: "Paid";
  date: string;
  initial: string;
  color: string;
}

const TransactionSchema = new Schema<ITransaction>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  plan: { type: String, required: true },
  amount: { type: String, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: ["Paid"], default: "Paid" },
  date: { type: String, required: true },
  initial: { type: String, required: true },
  color: { type: String, required: true },
});

export const Transaction = model<ITransaction>("Transaction", TransactionSchema);
