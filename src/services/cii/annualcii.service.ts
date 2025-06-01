import { AnnualCIIRepository } from '../../repositories/cii/annualcii.repository';
import { IAnnualCII } from '../../models/cii/AnnualCII';
import { ICIICalculation } from '../../types/second-formula.types';

export class AnnualCIIService {
  private annualCiiRepository: AnnualCIIRepository;

  constructor() {
    this.annualCiiRepository = new AnnualCIIRepository();
  }

  async createAnnualCii(
    mmsi: string,
    ciiData: { year: number; cii: ICIICalculation }[],
  ): Promise<IAnnualCII> {
    return await this.annualCiiRepository.create(mmsi, ciiData);
  }

  async getAllAnnualCii(): Promise<IAnnualCII[]> {
    return await this.annualCiiRepository.getAll();
  }

  async getAnnualCiiByMmsi(mmsi: string): Promise<IAnnualCII | null> {
    return await this.annualCiiRepository.getByMmsi(mmsi);
  }

  async getAnnualCiiByMmsiAndYear(
    mmsi: string,
    year: number,
  ): Promise<IAnnualCII | null> {
    return await this.annualCiiRepository.getByMMSIAndYear(mmsi, year);
  }

  async updateAnnualCii(
    mmsi: string,
    year: number,
    data: Partial<ICIICalculation>,
  ): Promise<IAnnualCII | null> {
    return await this.annualCiiRepository.update(mmsi, year, data);
  }

  async deleteAnnualCii(mmsi: string): Promise<IAnnualCII | null> {
    return await this.annualCiiRepository.delete(mmsi);
  }
}
