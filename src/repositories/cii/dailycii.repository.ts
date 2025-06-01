import { IDailyCII, DailyCII } from '../../models/cii/DailyCII';
import { ICIICalculation } from '../../types/second-formula.types';

export class DailyCIIRepository {
  async create(
    mmsi: string,
    ciiData: { timestamp: Date; cii: ICIICalculation }[],
  ): Promise<IDailyCII> {
    const dailyCii = new DailyCII({ mmsi, cii: ciiData });
    return await dailyCii.save();
  }

  async getAll(): Promise<IDailyCII[]> {
    return DailyCII.find();
  }

  async getByMmsi(mmsi: string): Promise<IDailyCII | null> {
    return DailyCII.findOne({ mmsi });
  }

  async getByMMSIAndTimestamp(
    mmsi: string,
    timestamp: Date,
  ): Promise<IDailyCII | null> {
    const dailyCii = await this.getByMmsi(mmsi);
    if (dailyCii) {
      const cii = dailyCii.cii.find(
        (cii) => cii.timestamp.toISOString() === timestamp.toISOString(),
      );
      if (cii) {
        return { ...dailyCii.toObject(), cii: [cii] };
      }
    }
    return null;
  }

  async update(
    mmsi: string,
    timestamp: Date,
    data: Partial<ICIICalculation>,
  ): Promise<IDailyCII | null> {
    const dailyCii = await this.getByMmsi(mmsi);
    if (dailyCii) {
      const ciiIndex = dailyCii.cii.findIndex(
        (cii) => cii.timestamp.toISOString() === timestamp.toISOString(),
      );
      if (ciiIndex !== -1) {
        dailyCii.cii[ciiIndex].cii = { ...dailyCii.cii[ciiIndex].cii, ...data };
        return await dailyCii.save();
      }
    }
    return null;
  }

  async delete(mmsi: string): Promise<IDailyCII | null> {
    return DailyCII.findOneAndDelete({ mmsi });
  }
}
