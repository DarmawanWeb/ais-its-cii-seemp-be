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

  async getDailyCiiByMmsiAndTimestamp(
    mmsi: string,
    timestamp: Date,
  ): Promise<IDailyCII | null> {
    return await this.dailyCiiRepository.getByMMSIAndTimestamp(mmsi, timestamp);
  }

  async updateDailyCii(
    mmsi: string,
    timestamp: Date,
    data: Partial<ICIICalculation>,
  ): Promise<IDailyCII | null> {
    return await this.dailyCiiRepository.update(mmsi, timestamp, data);
  }

  async deleteDailyCii(mmsi: string): Promise<IDailyCII | null> {
    return await this.dailyCiiRepository.delete(mmsi);
  }
}
