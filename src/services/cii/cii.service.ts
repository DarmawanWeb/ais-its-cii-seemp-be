import { AisRepository } from '../../repositories/ais.repository';
import { ShipRepository } from '../../repositories/ships/ships.repository';
import { IShip } from '../../models/ships/Ship';
import { IAis, IAisPosition } from '../../models/Ais';
import { calculateSpeed } from '../../utils/cii/speed-calculation';

export class CIIService {
  private shipRepository: ShipRepository;
  private aisRepository: AisRepository;
  constructor() {
    this.shipRepository = new ShipRepository();
    this.aisRepository = new AisRepository();
  }

  async calculateCII(
    positions: IAisPosition[],
    shipData: IShip,
  ): Promise<void> {
    console.log('Calculating CII for ship:', shipData.generalData);
    const speedData = calculateSpeed(positions);
    if (!speedData) {
      throw new Error('Insufficient data to calculate speed');
    }
  }

  async getCIIByMMSI(mmsi: string): Promise<void | null> {
    const ship: IShip | null = await this.shipRepository.getByMMSI(mmsi);
    if (!ship) {
      throw new Error(`Ship with MMSI ${mmsi} not found`);
    }

    const aisData: IAis | null = await this.aisRepository.getByMmsi(mmsi);
    if (!aisData) {
      throw new Error(`AIS data for MMSI ${mmsi} not found`);
    }

    if (!aisData.positions || aisData.positions.length < 2) {
      throw new Error(`Insufficient AIS positions for MMSI ${mmsi}`);
    }
    await this.calculateCII(aisData.positions, ship);
  }
}
