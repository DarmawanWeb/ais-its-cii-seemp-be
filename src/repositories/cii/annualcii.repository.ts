import { IAnnualCII, AnnualCII } from '../../models/cii/AnnualCII';
import { ICIICalculation } from '../../types/second-formula.types';

export class AnnualCIIRepository {
  async create(
    mmsi: string,
    ciiData: { year: number; cii: ICIICalculation }[],
  ): Promise<IAnnualCII> {
    const annualCii = new AnnualCII({ mmsi, cii: ciiData });
    return await annualCii.save();
  }

  async getAll(): Promise<IAnnualCII[]> {
    return AnnualCII.find();
  }

  async getByMmsi(mmsi: string): Promise<IAnnualCII | null> {
    return AnnualCII.findOne({ mmsi });
  }

  async getByMMSIAndYear(
    mmsi: string,
    year: number,
  ): Promise<IAnnualCII | null> {
    const annualCii = await this.getByMmsi(mmsi);
    if (annualCii) {
      const cii = annualCii.cii.find((cii) => cii.year === year);
      if (cii) {
        return { ...annualCii.toObject(), cii: [cii] };
      }
    }
    return null;
  }

  async update(
    mmsi: string,
    year: number,
    data: Partial<ICIICalculation>,
  ): Promise<IAnnualCII | null> {
    const annualCii = await this.getByMmsi(mmsi);
    if (annualCii) {
      const ciiIndex = annualCii.cii.findIndex((cii) => cii.year === year);
      if (ciiIndex !== -1) {
        annualCii.cii[ciiIndex].cii = {
          ...annualCii.cii[ciiIndex].cii,
          ...data,
        };
        return await annualCii.save();
      }
    }
    return null;
  }

  async delete(mmsi: string): Promise<IAnnualCII | null> {
    return AnnualCII.findOneAndDelete({ mmsi });
  }

  async getLastYearCII(
    mmsi: string,
  ): Promise<ICIICalculation | null> {
    const annualCii = await this.getByMmsi(mmsi);
    if (annualCii && annualCii.cii.length > 0) {
      const lastYearCII = annualCii.cii[annualCii.cii.length - 1];
      return lastYearCII.cii;
    }
    return null;
  }
}
