import { AisRepository } from '../../repositories/ais.repository';
import { ShipRepository } from '../../repositories/ships/ships.repository';

import { IAis, IAisPosition } from '../../models/Ais';
import { IShipData } from '../../types/ship.type';
import { calculateSpeed } from '../../utils/cii/speed-calculation';
import { calculateFirstFormulaFuel } from '../../utils/cii/fuel-calculation';

export class CIIService {
  private shipRepository: ShipRepository;
  private aisRepository: AisRepository;
  constructor() {
    this.shipRepository = new ShipRepository();
    this.aisRepository = new AisRepository();
  }

  async calculateCII(
    positions: IAisPosition[],
    shipData: IShipData,
  ): Promise<void> {
    const speedData = calculateSpeed(positions);
    if (!speedData) {
      throw new Error('Insufficient data to calculate speed');
    }
    const firstFormulaFuel = await calculateFirstFormulaFuel(
      positions[1].navstatus,
      shipData.fuelType,
      speedData.speedKnot,
      shipData.fuelFormulas.firstFuelFormula,
      speedData.timeDifferenceMinutes,
    );
    console.log('FIrst Formula Fuel:', firstFormulaFuel);
  }

  async getCIIByMMSI(mmsi: string): Promise<void | null> {
    const ship = await this.shipRepository.getByMMSI(mmsi);
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
    await this.calculateCII(aisData.positions, ship as IShipData);
  }
}
