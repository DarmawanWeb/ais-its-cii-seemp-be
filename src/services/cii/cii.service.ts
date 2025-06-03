import { IAis, IAisPosition } from '../../models/Ais';
import { AisRepository } from '../../repositories/ais.repository';
// import { IDailyCII } from '../../models/cii/DailyCII';
import { DailyCIIRepository } from '../../repositories/cii/dailycii.repository';
import { ShipRepository } from '../../repositories/ships/ships.repository';

import { IShipData } from '../../types/ship.type';

import { calculateSpeed } from '../../utils/cii/speed-calculation';
import {
  calculateFirstFormulaFuel,
  calculateSecondFormulaFuel,
} from '../../utils/cii/fuel-calculation';
import { calculateCII } from '../../utils/cii/cii-calculation';
import { ICIICalculation } from '../../types/second-formula.types';

export class CIIService {
  private shipRepository: ShipRepository;
  private aisRepository: AisRepository;
  private dailyCiiRepository: DailyCIIRepository;
  constructor() {
    this.shipRepository = new ShipRepository();
    this.aisRepository = new AisRepository();
    this.dailyCiiRepository = new DailyCIIRepository();
  }

  async calculateCII(
    positions: IAisPosition[],
    shipData: IShipData,
  ): Promise<ICIICalculation> {
    const speedData = calculateSpeed(positions);
    if (!speedData) {
      throw new Error('Insufficient data to calculate speed');
    }
    const latestCII = await this.dailyCiiRepository.getLatestByMmsi(
      shipData.mmsi,
    );

    let ciiResult: ICIICalculation | null = null;
    if (shipData.fuelFormulas.firstFuelFormula !== null) {
      const firstFormulaFuel = await calculateFirstFormulaFuel(
        positions[1].navstatus,
        shipData.fuelType,
        speedData.speedKnot,
        shipData.fuelFormulas.firstFuelFormula,
        speedData.timeDifferenceMinutes,
      );

      ciiResult = await calculateCII(
        shipData,
        firstFormulaFuel,
        speedData.distance,
        latestCII && latestCII.cii && latestCII.cii.length > 0
          ? (latestCII.cii[0].cii ?? null)
          : null,
      );
    } else {
      const secondFormulaFuel = await calculateSecondFormulaFuel(
        speedData,
        positions,
        shipData,
      );

      ciiResult = await calculateCII(
        shipData,
        secondFormulaFuel,
        speedData.distance,
        latestCII && latestCII.cii && latestCII.cii.length > 0
          ? (latestCII.cii[0].cii ?? null)
          : null,
      );
    }

    await this.dailyCiiRepository.update(shipData.mmsi, ciiResult);
    return ciiResult;
  }

  async getCIIByMMSI(mmsi: string): Promise<ICIICalculation> {
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
    const ciiResult = await this.calculateCII(
      aisData.positions,
      ship as IShipData,
    );
    if (!ciiResult) {
      throw new Error(`CII calculation failed for MMSI ${mmsi}`);
    }
    return ciiResult;
  }
}
