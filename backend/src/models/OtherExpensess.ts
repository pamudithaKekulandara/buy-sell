import mongoose, { Document, Schema } from 'mongoose';

export interface IOtherExpense extends Document {
  description: string;
  amount: number;
  date: Date;
}

const OtherExpenseSchema: Schema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IOtherExpense>('OtherExpense', OtherExpenseSchema);