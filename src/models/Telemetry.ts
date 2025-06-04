import mongoose, { Document, Schema } from 'mongoose';

export interface ITelemetry extends Document {
  mmsi: string;
  fuel: {
    fuelConsumptionMeTon: number;
    fuelConsumptionAeTon: number;
    totalFuelConsumptionTon: number;
    timestamp: Date;
  }[];
}

const fuelConsumptionSchema: Schema = new Schema(
  {
    fuelConsumptionMeTon: { type: Number, required: true },
    fuelConsumptionAeTon: { type: Number, required: true },
    totalFuelConsumptionTon: { type: Number, required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false },
);

const telemetrySchema: Schema = new Schema(
  {
    mmsi: {
      type: String,
      unique: true,
      required: true,
      ref: 'Ais',
    },
    fuel: { type: [fuelConsumptionSchema], required: true },
  },
  { timestamps: true },
);

const Telemetry = mongoose.model<ITelemetry>('Telemetry', telemetrySchema);

export { Telemetry };
