import { AnnualCIIRepository } from '../../repositories/cii/annualcii.repository';
import { ShipRepository } from '../../repositories/ships/ships.repository';
import { IAnnualCII } from '../../models/cii/AnnualCII';
import {
  ICIICalculation,
  IAnnualCIIWithDDVector,
} from '../../types/second-formula.types';

export class AnnualCIIService {
  private annualCiiRepository: AnnualCIIRepository;
  private shipRepository: ShipRepository;

  constructor() {
    this.annualCiiRepository = new AnnualCIIRepository();
    this.shipRepository = new ShipRepository();
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
  async getAnnualCiiByMMMSIWithDDVector(
    mmsi: string,
  ): Promise<IAnnualCIIWithDDVector[] | null> {
    const annualCII = this.annualCiiRepository.getByMmsi(mmsi);
    const shipType = this.shipRepository.getShipTypeByMmsi(mmsi);

    return Promise.all([annualCII, shipType]).then(
      ([annualCIIData, shipTypeData]) => {
        if (!annualCIIData || !shipTypeData) {
          return null;
        }

        return annualCIIData.cii.map((annualCii) => {
          const { d1, d2, d3, d4 } = shipTypeData.d;
          const { ciiRequired } = annualCii.cii;

          const result = {
            year: annualCii.year,
            ciiRequired: annualCii.cii.ciiRequired,
            ciiAttained: annualCii.cii.ciiAttained,
            ciiRating: annualCii.cii.ciiRating,
            ciiGrade: annualCii.cii.ciiGrade,
            totalDistance: annualCii.cii.totalDistance,
            ddVector: {
              d1: d1 * ciiRequired,
              d2: d2 * ciiRequired,
              d3: d3 * ciiRequired,
              d4: d4 * ciiRequired,
            },
          };

          return result;
        });
      },
    );
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
