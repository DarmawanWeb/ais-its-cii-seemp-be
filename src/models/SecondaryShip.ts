import mongoose, { Document, Schema } from 'mongoose';

export interface ISecondaryShip extends Document {
  IMO: string;
  MMSI: string;
  NAME: string;
  BUILT: string;
  FLAG: string;
  FLAGNAME: string;
  TYPE: string;
  TYPENAME: string;
  GT: string;
  DWT: string;
  LOA: string;
  BEAM: string;
  DRAUGHT: string;
  CLASS: string;
  CLASSCODE: string;
}

const secondaryShipSchema: Schema = new Schema<ISecondaryShip>(
  {
    IMO: {
      type: String,
      required: true,
      index: true,
    },
    MMSI: {
      type: String,
      required: true,
      unique: true,
    },
    NAME: {
      type: String,
      required: true,
    },
    BUILT: {
      type: String,
    },
    FLAG: {
      type: String,
    },
    FLAGNAME: {
      type: String,
    },
    TYPE: {
      type: String,
    },
    TYPENAME: {
      type: String,
    },
    GT: {
      type: String,
    },
    DWT: {
      type: String,
    },
    LOA: {
      type: String,
    },
    BEAM: {
      type: String,
    },
    DRAUGHT: {
      type: String,
    },
    CLASS: {
      type: String,
    },
    CLASSCODE: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const SecondaryShip = mongoose.model<ISecondaryShip>(
  'SecondaryShip',
  secondaryShipSchema,
);

export { SecondaryShip };
