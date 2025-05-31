import mongoose, { Document, Schema } from 'mongoose';

export interface IFirstFuelFormula extends Document {
  mainEngineFormula: string;
  auxiliaryEngineFormula: string;
}

const firstFuelFormulaSchema: Schema = new Schema({
  mainEngineFormula: { type: String, required: true },
  auxiliaryEngineFormula: { type: String, required: true },
});

const FirstFuelFormula = mongoose.model<IFirstFuelFormula>(
  'FirstFuelFormula',
  firstFuelFormulaSchema,
);

export { FirstFuelFormula };
