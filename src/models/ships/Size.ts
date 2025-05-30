import mongoose, { Document, Schema } from 'mongoose';

export interface IShipSize extends Document {
  capacity: number;
  blockCoefficient: number;
  waterlineLength: number;
  breadth: number;
  draft: number;
  waterplaneCoefficient: number;
  overallLength: number;
  perpendicularLength: number;
  midshipCoefficient: number;
  volumeCoefficient: number;
  bulbousBow: boolean;
  sternCoefficient: number;
  additionalCoefficients: {
    coefficient1: number;
    coefficient2: number;
    coefficient3: number;
    coefficient5: number;
  };
  speed: number;
}

const shipSizeSchema: Schema = new Schema({
  capacity: { type: Number, required: true },
  blockCoefficient: { type: Number, required: true },
  waterlineLength: { type: Number, required: true },
  breadth: { type: Number, required: true },
  draft: { type: Number, required: true },
  waterplaneCoefficient: { type: Number, required: true },
  overallLength: { type: Number, required: true },
  perpendicularLength: { type: Number, required: true },
  midshipCoefficient: { type: Number, required: true },
  volumeCoefficient: { type: Number, required: true },
  bulbousBow: { type: Boolean, required: true },
  sternCoefficient: { type: Number, required: true },
  additionalCoefficients: {
    coefficient1: { type: Number, required: true },
    coefficient2: { type: Number, required: true },
    coefficient3: { type: Number, required: true },
    coefficient5: { type: Number, required: true },
  },
  speed: { type: Number, required: true },
});

const ShipSize = mongoose.model<IShipSize>('ShipSize', shipSizeSchema);

export { ShipSize };
