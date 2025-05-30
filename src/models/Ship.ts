import mongoose, { Document, Schema } from 'mongoose';

export interface IVessel extends Document {
  mmsi: string;
  generalData: mongoose.Schema.Types.ObjectId;
  sizeData: mongoose.Schema.Types.ObjectId;
  typeData: mongoose.Schema.Types.ObjectId;
  fuelType: mongoose.Schema.Types.ObjectId;
  engineSpecs: {
    mainEngine: mongoose.Schema.Types.ObjectId;
    auxiliaryEngine: mongoose.Schema.Types.ObjectId;
  };
  fuelFormulas: {
    firstFuelFormula: mongoose.Schema.Types.ObjectId;
  };
}

const vesselSchema: Schema = new Schema({
  mmsi: {
    type: String,
    unique: true,
    required: true,
    ref: 'Ais',
  },
  generalData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShipGeneral',
    required: true,
  },
  sizeData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShipSize',
    required: true,
  },
  typeData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShipType',
    required: true,
  },
  fuelType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fuel',
    required: true,
  },
  engineSpecs: {
    mainEngine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MainEngine',
      required: true,
    },
    auxiliaryEngine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuxiliaryEngine',
      required: true,
    },
  },
  fuelFormulas: {
    firstFuelFormula: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FirstFuelFormula',
      required: true,
    },
  },
});

const Vessel = mongoose.model<IVessel>('Vessel', vesselSchema);

export { Vessel };
