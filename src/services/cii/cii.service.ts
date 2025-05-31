import { AisRepository } from '../../repositories/ais.repository';
import { ShipRepository } from '../../repositories/ships/ships.repository';

import { IAis, IAisPosition } from '../../models/Ais';
import { IShipData } from '../../types/ship.type';
import { calculateSpeed } from '../../utils/cii/speed-calculation';
import { calculateFirstFormulaFuel } from '../../utils/cii/fuel-calculation';
import {
  calculateWindCourse,
  calculateShipCourse,
} from '../../utils/cii/second-formula/course-calculation';
import {
  getWeatherByLocation,
  type ICurrentWeather,
} from '../../utils/cii/weather';
import { calculateCoefisienReduction } from '../../utils/cii/second-formula/coefisien-reduction-calculation';
import { calculateFrictionResistance } from '../../utils/cii/second-formula/friction-resistance-calculation';

import { IWindCourse } from '../../types/second-formula.types';

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
    const currentWeather = (await getWeatherByLocation(
      positions[1].lat,
      positions[1].lon,
    )) as ICurrentWeather | string;

    const shipCourse = calculateShipCourse(
      speedData.firstPositionRad,
      speedData.secondPositionRad,
    );

    if (typeof currentWeather === 'string') {
      throw new Error(`Weather data retrieval failed: ${currentWeather}`);
    }
    if (!currentWeather) {
      throw new Error('Current weather data is not available');
    }

    const windCourse: IWindCourse = calculateWindCourse(
      shipCourse,
      currentWeather,
    );

    const coefReduction = calculateCoefisienReduction(
      windCourse,
      speedData.speedMs,
      shipData.sizeData,
    );

    const frictionResistance = calculateFrictionResistance(
      speedData,
      coefReduction,
      shipData.sizeData,
    );

    console.log('First Formula Fuel:', firstFormulaFuel);
    console.log('Wind Course:', windCourse);
    console.log('Coefisien Reduction:', coefReduction);
    console.log('Friction Resistance:', frictionResistance);
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
