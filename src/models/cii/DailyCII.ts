import mongoose, { Document, Schema } from 'mongoose';
import { ICIICalculation } from '../../types/second-formula.types';

export interface IDailyCII extends Document {
  mmsi: string;
  cii: {
    timestamp: Date;
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

const dailyCIISchema: Schema = new Schema({
  mmsi: { type: String, required: true, ref: 'Ais' },
  cii: [
    {
      timestamp: { type: Date, required: true },
      cii: { type: ciiCalculationSchema, required: true },
    },
  ],
});

const DailyCII = mongoose.model<IDailyCII>('DailyCII', dailyCIISchema);

export { DailyCII };
