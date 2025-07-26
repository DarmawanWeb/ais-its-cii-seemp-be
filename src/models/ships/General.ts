import mongoose, { Document, Schema } from 'mongoose';

export interface IShipGeneral extends Document {
  name: string;
  flag: string;
  built?: string;
  imoNumber: string;
  annualVoyagePercentage: number;
  shipStatus: string;
  photoUrl?: string;
}

const shipGeneralSchema: Schema = new Schema({
  name: { type: String, required: true },
  built: { type: String },
  flag: { type: String, required: true },
  imoNumber: { type: String, required: true },
  annualVoyagePercentage: { type: Number, required: true },
  shipStatus: { type: String, required: true },
  photoUrl: { type: String },
});

const ShipGeneral = mongoose.model<IShipGeneral>(
  'ShipGeneral',
  shipGeneralSchema,
);

export { ShipGeneral };
