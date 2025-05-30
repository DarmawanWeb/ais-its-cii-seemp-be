import mongoose, { Document, Schema } from 'mongoose';

export interface IFirstFuelFormula extends Document {
  formulas: {
    normal: {
      mainEngineFormula: string;
      auxiliaryEngineFormula: string;
    };
    underDraft: {
      mainEngineFormula: string;
      auxiliaryEngineFormula: string;
    };
    other: {
      mainEngineFormula: string;
      auxiliaryEngineFormula: string;
    };
  };
}

const firstFuelFormulaSchema: Schema = new Schema({
  formulas: {
    normal: {
      mainEngineFormula: { type: String, required: true },
      auxiliaryEngineFormula: { type: String, required: true },
    },
    underDraft: {
      mainEngineFormula: { type: String, required: true },
      auxiliaryEngineFormula: { type: String, required: true },
    },
    other: {
      mainEngineFormula: { type: String, required: true },
      auxiliaryEngineFormula: { type: String, required: true },
    },
  },
});

const FirstFuelFormula = mongoose.model<IFirstFuelFormula>(
  'FirstFuelFormula',
  firstFuelFormulaSchema,
);

export { FirstFuelFormula };
