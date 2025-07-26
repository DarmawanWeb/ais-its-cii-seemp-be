import { IAis, IAisPosition } from '../../models/Ais';
import { AisRepository } from '../../repositories/ais.repository';
// import { IDailyCII } from '../../models/cii/DailyCII';
import { FuelDataRepository } from '../../repositories/ships/fuel-data.repository';
import { DailyCIIRepository } from '../../repositories/cii/dailycii.repository';
import { ShipRepository } from '../../repositories/ships/ships.repository';

import { IShipData } from '../../types/ship.type';

import { calculateSpeed } from '../../utils/cii/speed-calculation';
import {
  calculateFirstFormulaFuel,
  calculateSecondFormulaFuel,
} from '../../utils/cii/fuel-calculation';
import { calculateCII } from '../../utils/cii/cii-calculation';
import { ICIICalculation, IFuelConsumption } from '../../types/second-formula.types';

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
    let latestCII: ICIICalculation | null = null;
    try {
      const res =  await this.dailyCiiRepository.getLatestByMmsi(
        shipData.mmsi,
      );
      latestCII = res?.cii[0]?.cii ?? null;
      if (!latestCII) {
        latestCII = {
          ciiRequired: 62.56963961854975,
          ciiAttained: 128.5322355807646,
          ciiRating: 2.054226880070749,
          ciiGrade: "E",
          totalDistance: 0.00043715911651287536,
          fuelConsumption: {
            fuelConsumptionMeTon: 0.000019404781014131148,
            fuelConsumptionAeTon: 0.000031018133492449096,
            totalFuelConsumptionTon: 0.000050422914506580244,
          },
        };
      }
    } catch (error) {
      console.error(`Error fetching latest CII for MMSI ${shipData.mmsi}:`, error);
    }

    console.log(
      `Calculating CII for MMSI ${shipData.mmsi} with speed data:`,
      speedData,
    );
    let ciiResult: ICIICalculation | null = null;

    const isTelemetryActive = await FuelDataRepository.isActive(shipData.mmsi);


    if (isTelemetryActive) {
     
      const fuelData = await FuelDataRepository.getLatestByMMSI(shipData.mmsi);
      if (!fuelData) {
        throw new Error(`Fuel data for MMSI ${shipData.mmsi} is not available`);
      }
      const formatFuelData: IFuelConsumption = {
        fuelConsumptionMeTon: Number(fuelData.fuelLogs[0].fuelME),
        fuelConsumptionAeTon: Number(fuelData.fuelLogs[0].fuelAE),
        totalFuelConsumptionTon: Number(fuelData.fuelLogs[0].fuelAE.toString()) + Number(fuelData.fuelLogs[0].fuelME.toString())
      }
      ciiResult = await calculateCII(
        shipData,
        formatFuelData,
        speedData.distance,
        latestCII,
      );
    } else if(shipData.fuelFormulas?.firstFuelFormula !== null) {
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
        latestCII,
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
        latestCII,
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
    console.log(`CII calculated for MMSI ${mmsi}:`, ciiResult);
    if (!ciiResult) {
      throw new Error(`CII calculation failed for MMSI ${mmsi}`);
    }
    return ciiResult;
  }
}
