import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAttendance {
  _id?: Types.ObjectId; // Add _id field for subdocuments
  date: Date;
  workType: 'full-day' | 'half-day' | 'absent';
}

export interface IEmployee extends Document {
  name: string;
  position: string;
  salary: number;
  attendance: Types.DocumentArray<IAttendance>; // Use DocumentArray for subdocuments
}

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  attendance: [
    {
      date: { type: Date, default: Date.now },
      workType: { type: String, enum: ['full-day', 'half-day', 'absent'], required: true },
    },
  ],
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);