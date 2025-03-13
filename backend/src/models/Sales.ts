import mongoose, { Document, Schema } from 'mongoose';

export interface ISale extends Document {
  product: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  saleDate: Date;
}

const SaleSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
});

export default mongoose.model<ISale>('Sale', SaleSchema);