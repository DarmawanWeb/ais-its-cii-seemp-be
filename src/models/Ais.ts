import mongoose, { Schema } from 'mongoose';
export interface IAisPosition {
  navstatus: number;
  predictedNavStatus: number;
  ewsStatus: number;
  lat: number;
  lon: number;
  sog: number;
  cog: number;
  hdg: number;
  timestamp: Date;
}

export interface IAis extends Document {
  mmsi: string;
  icon?: string;
  positions: IAisPosition[];
}

const positionSchema = new Schema(
  {
    navstatus: { type: Number, required: true },
    predictedNavStatus: { type: Number, required: true },
    ewsStatus: { type: Number, default: 3 },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    sog: { type: Number, required: true },
    cog: { type: Number, required: true },
    hdg: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const aisSchema = new Schema(
  {
    mmsi: { type: String, unique: true, required: true },
    positions: {
      type: [positionSchema],
      required: true,
    },
  },
  { timestamps: true },
);

const Ais = mongoose.model<IAis>('Ais', aisSchema);

export default Ais;
