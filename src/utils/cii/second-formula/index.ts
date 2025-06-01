import { IAisPosition } from '../../../models/Ais';
import { IShipData } from '../../../types/ship.type';
import { getWeatherByLocation, type ICurrentWeather } from '../weather';
import { calculateCoefisienReduction } from '../second-formula/coefisien-reduction-calculation';
import { calculateFrictionResistance } from '../second-formula/friction-resistance-calculation';
import { calculateTotalResistance } from '../second-formula/total-resistance-calculation';
import {
  calculateWindCourse,
  calculateShipCourse,
} from '../second-formula/course-calculation';
import { calculateBHPMCR } from '../second-formula/power-calculation';
import {
  IWindCourse,
  ISpeedCalculation,
  IPreCalculateSecondFormulaFuel,
} from '../../../types/second-formula.types';

export const perCalculateSecondFormulaFuel = async (
  speedData: ISpeedCalculation,
  positions: IAisPosition[],
  shipData: IShipData,
): Promise<IPreCalculateSecondFormulaFuel> => {
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

  const totalResistance = calculateTotalResistance(
    shipData.sizeData,
    frictionResistance,
  );

  const bhpMCR = calculateBHPMCR(
    frictionResistance,
    totalResistance,
    shipData.sizeData,
  );
  return {
    bhpMCR,
    frictionResistance,
  };
};
