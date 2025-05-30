import mongoose, { Document, Schema } from 'mongoose';

export interface IMainEngine extends Document {
  engineName: string;
  rpm: number;
  power: number;
  specificFuelOilConsumption: number;
  quantity: number;
}

const mainEngineSchema: Schema = new Schema({
  engineName: { type: String, required: true },
  rpm: { type: Number, required: true },
  power: { type: Number, required: true },
  specificFuelOilConsumption: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const MainEngine = mongoose.model<IMainEngine>('MainEngine', mainEngineSchema);

export { MainEngine };
