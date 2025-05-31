import mongoose from 'mongoose';

export interface IZValue extends mongoose.Document {
  year: number;
  zValue: number;
}

const zValueSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  zValue: { type: Number, required: true },
});

const ZValue = mongoose.model<IZValue>('ZValue', zValueSchema);

export { ZValue };
