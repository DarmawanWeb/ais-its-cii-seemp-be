import mongoose, { Document, Schema } from 'mongoose';

export interface IFuel extends Document {
  fuelType: string;
  carbonContent: number;
  conversionFactor: number;
  fuelDensity: number;
}

const fuelSchema: Schema = new Schema({
  fuelType: { type: String, required: true },
  carbonContent: { type: Number, required: true },
  conversionFactor: { type: Number, required: true },
  fuelDensity: { type: Number, required: true },
});

const Fuel = mongoose.model<IFuel>('Fuel', fuelSchema);

export { Fuel };
