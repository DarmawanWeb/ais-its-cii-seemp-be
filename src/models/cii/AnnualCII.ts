import mongoose, { Document, Schema } from 'mongoose';
import { ICIICalculation } from '../../types/second-formula.types';

export interface IAnnualCII extends Document {
  mmsi: string;
  cii: {
    year: number;
    cii: ICIICalculation;
  }[];
}

const fuelConsumptionSchema: Schema = new Schema(
  {
    fuelConsumptionMeTon: { type: Number, required: true },
    fuelConsumptionAeTon: { type: Number, required: true },
    totalFuelConsumptionTon: { type: Number, required: true },
  },
  { _id: false },
);

const ciiCalculationSchema: Schema = new Schema(
  {
    ciiRequired: { type: Number, required: true },
    ciiAttained: { type: Number, required: true },
    ciiRating: { type: Number, required: true },
    ciiGrade: { type: String, required: true },
    totalDistance: { type: Number, required: true },
    fuelConsumption: { type: fuelConsumptionSchema, required: true },
  },
  { _id: false },
);

const annualCIISchema: Schema = new Schema({
  mmsi: { type: String, unique: true, required: true, ref: 'Ais' },
  cii: [
    {
      year: { type: Number, required: true },
      cii: { type: ciiCalculationSchema, required: true },
    },
  ],
});

const AnnualCII = mongoose.model<IAnnualCII>('AnnualCII', annualCIISchema);

export { AnnualCII };
