import mongoose, { Document, Schema } from 'mongoose';

export interface IAuxiliaryEngine extends Document {
  generatorType: string;
  rpm: number;
  power: number;
  specificFuelOilConsumption: number;
  quantity: number;
}

const auxiliaryEngineSchema: Schema = new Schema({
  generatorType: { type: String, required: true },
  rpm: { type: Number, required: true },
  power: { type: Number, required: true },
  specificFuelOilConsumption: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const AuxiliaryEngine = mongoose.model<IAuxiliaryEngine>(
  'AuxiliaryEngine',
  auxiliaryEngineSchema,
);

export { AuxiliaryEngine };
