import { DailyCIIRepository } from '../../repositories/cii/dailycii.repository';
import { IDailyCII } from '../../models/cii/DailyCII';
import { ICIICalculation } from '../../types/second-formula.types';

export class DailyCIIService {
  private dailyCiiRepository: DailyCIIRepository;

  constructor() {
    this.dailyCiiRepository = new DailyCIIRepository();
  }

  async createDailyCii(
    mmsi: string,
    ciiData: { timestamp: Date; cii: ICIICalculation }[],
  ): Promise<IDailyCII> {
    return await this.dailyCiiRepository.create(mmsi, ciiData);
  }

  async getAllDailyCii(): Promise<IDailyCII[]> {
    return await this.dailyCiiRepository.getAll();
  }

  async getDailyCiiByMmsi(mmsi: string): Promise<IDailyCII | null> {
    return await this.dailyCiiRepository.getByMmsi(mmsi);
  }

  async getLatestDailyCiiByMmsi(mmsi: string): Promise<IDailyCII | null> {
    return await this.dailyCiiRepository.getLatestByMmsi(mmsi);
  }

  async deleteDailyCii(mmsi: string): Promise<IDailyCII | null> {
    return await this.dailyCiiRepository.delete(mmsi);
  }
}
