import mongoose, { Document, Schema } from 'mongoose';

export interface IShipSize extends Document {
  capacity: number;
  cb: number;
  lwl: number;
  b: number;
  t: number;
  cwp: number;
  loa: number;
  lpp: number;
  cp: number;
  cm: number;
  cbnsp: number;
  bulbosbow: boolean;
  cstern: number;
  c1: number;
  c2: number;
  c3: number;
  c5: number;
  vs: number;
}

const shipSizeSchema: Schema = new Schema({
  capacity: { type: Number, required: true },
  cb: { type: Number, required: true },
  lwl: { type: Number, required: true },
  b: { type: Number, required: true },
  t: { type: Number, required: true },
  cwp: { type: Number, required: true },
  loa: { type: Number, required: true },
  lpp: { type: Number, required: true },
  cp: { type: Number, required: true },
  cm: { type: Number, required: true },
  cbnsp: { type: Number, required: true },
  bulbosbow: { type: Boolean, required: true },
  cstern: { type: Number, required: true },
  c1: { type: Number, required: true },
  c2: { type: Number, required: true },
  c3: { type: Number, required: true },
  c5: { type: Number, required: true },
  vs: { type: Number, required: true },
});

const ShipSize = mongoose.model<IShipSize>('ShipSize', shipSizeSchema);

export { ShipSize };
