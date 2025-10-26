import mongoose, { Document, Schema } from 'mongoose';

export interface IIllegalTranshipmentResult extends Document {
  ship1MMSI: string;
  ship2MMSI: string;
  isIllegal: boolean;
  startTimestamp?: Date;
  endTimestamp?: Date;
  accuracy?: number;
  averagePriority?: number;
  priorityDistribution?: {
    low: number;
    medium: number;
    high: number;
  };
  detectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const illegalTranshipmentResultSchema: Schema = new Schema(
  {
    ship1MMSI: {
      type: String,
      required: true,
      ref: 'Ais',
    },
    ship2MMSI: {
      type: String,
      required: true,
      ref: 'Ais',
    },
    isIllegal: {
      type: Boolean,
      required: true,
    },
    startTimestamp: {
      type: Date,
    },
    endTimestamp: {
      type: Date,
    },
    accuracy: {
      type: Number,
    },
    averagePriority: {
      type: Number,
    },
    priorityDistribution: {
      low: { type: Number },
      medium: { type: Number },
      high: { type: Number }
    },
    detectedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true },
);

illegalTranshipmentResultSchema.index({ ship1MMSI: 1, ship2MMSI: 1 });
illegalTranshipmentResultSchema.index({ detectedAt: -1 });

const IllegalTranshipmentResult = mongoose.model<IIllegalTranshipmentResult>(
  'IllegalTranshipmentResult',
  illegalTranshipmentResultSchema,
);

export { IllegalTranshipmentResult };