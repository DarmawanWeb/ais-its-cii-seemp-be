import mongoose, { Document, Schema } from 'mongoose';

export interface IPort extends Document {
  name: string;
  code: string;
  administrativeLocation: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const portSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  administrativeLocation: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
});

const Port = mongoose.model<IPort>('Port', portSchema);
export { Port };
