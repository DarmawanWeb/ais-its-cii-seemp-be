import mongoose, { Document, Schema } from 'mongoose';
import { IDdVector } from '../../types/second-formula.types';

export interface IShipType extends Document {
  name: string;
  capacityUnit: string;
  a: number;
  c: number;
  d: IDdVector;
}

const shipTypeSchema: Schema = new Schema({
  name: { type: String, required: true },
  capacityUnit: { type: String, required: true },
  a: { type: Number, required: true },
  c: { type: Number, required: true },
  d: {
    d1: { type: Number },
    d2: { type: Number },
    d3: { type: Number },
    d4: { type: Number },
  },
});

const ShipType = mongoose.model<IShipType>('ShipType', shipTypeSchema);

export { ShipType };
