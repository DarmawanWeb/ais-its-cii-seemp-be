import mongoose, { Document, Schema } from 'mongoose';

export interface IIlegallTranshipmentQueue extends Document {
  ship1MMSI: string;
  ship2MMSI: string;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const illegalTranshipmentQueueSchema: Schema = new Schema(
  {
    ship1MMSI: {
      type: String,
      required: true,
      ref: 'Ais',
    },
    ship2MMSI: { type: String, required: true, ref: 'Ais' },
    priority: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);
const IllegalTranshipmentQueue = mongoose.model<IIlegallTranshipmentQueue>(
  'IllegalTranshipmentQueue',
  illegalTranshipmentQueueSchema,
);
export { IllegalTranshipmentQueue };
