import { Schema, model, Document } from "mongoose";

export interface IExpense extends Document {
  id: number;
  title: string;
  category: string;
  amount: string;
  status: "Paid";
  date: string;
  initial: string;
  color: string;
}

const ExpenseSchema = new Schema<IExpense>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: String, required: true },
  status: { type: String, enum: ["Paid"], default: "Paid" },
  date: { type: String, required: true },
  initial: { type: String, required: true },
  color: { type: String, required: true },
});

export const Expense = model<IExpense>("Expense", ExpenseSchema);
