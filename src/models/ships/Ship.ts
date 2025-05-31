import mongoose, { Document, Schema } from 'mongoose';

export interface IShip extends Document {
  mmsi: string;
  generalData: mongoose.Schema.Types.ObjectId;
  sizeData: mongoose.Schema.Types.ObjectId;
  typeData: mongoose.Schema.Types.ObjectId;
  fuelType: mongoose.Schema.Types.ObjectId;
  engineSpecs: {
    mainEngine: {
      engine: mongoose.Schema.Types.ObjectId;
      quantity: number;
    };
    auxiliaryEngine: {
      engine: mongoose.Schema.Types.ObjectId[];
      quantity: number;
    };
  };
  fuelFormulas?: {
    firstFuelFormula: mongoose.Schema.Types.ObjectId;
  };
  shipPort?: mongoose.Schema.Types.ObjectId[];
}

const shipSchema: Schema = new Schema({
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
      engine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainEngine',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
    auxiliaryEngine: {
      engine: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AuxiliaryEngine',
          required: true,
        },
      ],
      quantity: {
        type: Number,
        required: true,
      },
    },
  },
  fuelFormulas: {
    firstFuelFormula: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FirstFuelFormula',
      required: false,
    },
  },
  shipPort: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Port',
      required: false,
    },
  ],
});

const Ship = mongoose.model<IShip>('Ship', shipSchema);

export { Ship };
