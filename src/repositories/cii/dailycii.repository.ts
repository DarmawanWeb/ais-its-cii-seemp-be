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

  async update(
    mmsi: string,
    lastCii: ICIICalculation,
  ): Promise<IDailyCII | null> {
    const dailyCII = DailyCII.findOneAndUpdate(
      { mmsi },
      { $push: { cii: { timestamp: new Date(), cii: lastCii } } },
      { new: true, upsert: true },
    );
    return dailyCII;
  }

  async getAll(): Promise<IDailyCII[]> {
    return DailyCII.find();
  }

  async getByMmsi(mmsi: string): Promise<IDailyCII | null> {
    return DailyCII.findOne({ mmsi });
  }

  async getLatestByMmsi(mmsi: string): Promise<IDailyCII | null> {
    const dailyCII = await DailyCII.findOne({ mmsi }).sort({
      'cii.timestamp': -1,
    });
    if (dailyCII && dailyCII.cii.length > 0) {
      dailyCII.cii = [dailyCII.cii[dailyCII.cii.length - 1]];
      return dailyCII;
    }
    return null;
  }

  async delete(mmsi: string): Promise<IDailyCII | null> {
    return DailyCII.findOneAndDelete({ mmsi });
  }
}
