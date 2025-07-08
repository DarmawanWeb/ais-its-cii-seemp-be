import mongoose, { Schema, Types } from "mongoose";

export interface IFuelEntry {
  fuelME: Types.Decimal128;
  fuelAE: Types.Decimal128;
  timestamp?: Date;
}

export interface IFuelData extends mongoose.Document {
  mmsi: string;
  fuelLogs: IFuelEntry[];
  createdAt?: Date;
  updatedAt?: Date;
}

const fuelEntrySchema = new Schema<IFuelEntry>(
  {
    fuelME: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    fuelAE: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const fuelDataSchema = new Schema<IFuelData>(
  {
    mmsi: {
      type: String,
      required: true,
      ref: "Ais", 
    },
    fuelLogs: {
      type: [fuelEntrySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const FuelData = mongoose.model<IFuelData>("FuelData", fuelDataSchema);

export default FuelData;
