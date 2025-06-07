import { DailyCIIRepository } from '../../repositories/cii/dailycii.repository';
import { IDailyCII } from '../../models/cii/DailyCII';
import { ICIICalculation, ICIIGrafik } from '../../types/second-formula.types';
import { ShipRepository } from '../../repositories/ships/ships.repository';

export class DailyCIIService {
  private dailyCiiRepository: DailyCIIRepository;
  private shipRepository: ShipRepository;

  constructor() {
    this.dailyCiiRepository = new DailyCIIRepository();
    this.shipRepository = new ShipRepository();
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

  async getAttainedCiiByMmsi(mmsi: string): Promise<ICIIGrafik | null> {
    const dailyCII = await this.dailyCiiRepository.getByMmsi(mmsi);
    const type = await this.shipRepository.getShipTypeByMmsi(mmsi);

    if (dailyCII && dailyCII.cii.length > 0) {
      const ciiData = dailyCII.cii.map((item) => ({
        ciiAttained: item.cii.ciiAttained,
        timestamp: item.timestamp.toISOString(),
      }));

      const ddVector = type?.d
        ? {
            d1: type.d.d1 * dailyCII.cii[0].cii.ciiRequired,
            d2: type.d.d2 * dailyCII.cii[0].cii.ciiRequired,
            d3: type.d.d3 * dailyCII.cii[0].cii.ciiRequired,
            d4: type.d.d4 * dailyCII.cii[0].cii.ciiRequired,
          }
        : { d1: 0, d2: 0, d3: 0, d4: 0 };

      return { ciiData, ddVector };
    }
    return null;
  }

  async deleteDailyCii(mmsi: string): Promise<IDailyCII | null> {
    return await this.dailyCiiRepository.delete(mmsi);
  }
}
