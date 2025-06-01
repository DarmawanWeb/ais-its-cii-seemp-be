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

  async getLatestByMmsi(mmsi: string): Promise<IDailyCII | null> {
    return DailyCII.findOne({ mmsi }).sort({ 'cii.timestamp': -1 });
  }

  async delete(mmsi: string): Promise<IDailyCII | null> {
    return DailyCII.findOneAndDelete({ mmsi });
  }
}
