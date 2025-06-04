import { IFuel } from '../../models/ships/Fuel';
import { IFirstFuelFormula } from '../../models/ships/FirstFuelFormula';
import {
  IFuelConsumption,
  ISpeedCalculation,
} from '../../types/second-formula.types';
import { IShipData } from '../../types/ship.type';
import { perCalculateSecondFormulaFuel } from '../cii/second-formula';
import { IAisPosition } from '../../models/Ais';

const fuelMultipliers: Record<number, { ME: number; AE: number }> = {
  0: { ME: 1, AE: 1 },
  1: { ME: 0, AE: 0.5 },
  2: { ME: 1, AE: 1 },
  3: { ME: 0.5, AE: 1 },
  4: { ME: 0.5, AE: 1 },
  5: { ME: 0, AE: 1 },
  6: { ME: 1, AE: 1 },
  7: { ME: 0.5, AE: 1 },
  8: { ME: 1, AE: 1 },
  9: { ME: 1, AE: 1 },
  10: { ME: 1, AE: 1 },
  11: { ME: 1, AE: 1 },
  12: { ME: 1, AE: 1 },
  13: { ME: 1, AE: 1 },
  14: { ME: 0, AE: 0 },
  15: { ME: 1, AE: 1 },
};

const getFuelByNavStatus = (
  navstatus: number,
  fuelMe: number,
  fuelAe: number,
): { totalME: number; totalAE: number } => {
  const multipliers = fuelMultipliers[navstatus];
  if (!multipliers) return { totalME: 0, totalAE: 0 };
  return {
    totalME: fuelMe * multipliers.ME,
    totalAE: fuelAe * multipliers.AE,
  };
};

const calculateTotalFuelTon = (
  totalFuelEstimate: number,
  fuelDensity: number,
): number => {
  return (totalFuelEstimate * fuelDensity) / 1000;
};

const evaluateFormula = (
  formula: string,
  context: { speedKnot: number },
): number => {
  try {
    const safeEval = new Function(
      'context',
      `with (context) { return ${formula}; }`,
    );
    return Math.max(safeEval(context), 0.5);
  } catch (e) {
    console.error('Error evaluating formula:', e);
    return 0.5;
  }
};

export const calculateFirstFormulaFuel = async (
  navstatus: number,
  fuelType: IFuel,
  speedKnot: number,
  fuelFormulas: IFirstFuelFormula,
  timeDifferenceMinutes: number,
): Promise<IFuelConsumption> => {
  if (!fuelType || !fuelFormulas) {
    throw new Error('Fuel type or fuel formulas are not provided');
  }
  const context = { speedKnot };

  const fuelEstimateME = evaluateFormula(
    fuelFormulas.mainEngineFormula,
    context,
  );
  const fuelEstimateAE = evaluateFormula(
    fuelFormulas.auxiliaryEngineFormula,
    context,
  );

  const fuelData = getFuelByNavStatus(
    navstatus,
    fuelEstimateME,
    fuelEstimateAE,
  );

  const totalFuelEstimate =
    (fuelData.totalME + fuelData.totalAE) * timeDifferenceMinutes;

  return {
    fuelConsumptionMeTon: calculateTotalFuelTon(
      fuelData.totalME * timeDifferenceMinutes,
      fuelType.fuelDensity,
    ),
    fuelConsumptionAeTon: calculateTotalFuelTon(
      fuelData.totalAE * timeDifferenceMinutes,
      fuelType.fuelDensity,
    ),
    totalFuelConsumptionTon: calculateTotalFuelTon(
      totalFuelEstimate,
      fuelType.fuelDensity,
    ),
  };
};

export const calculateSecondFormulaFuel = async (
  speedData: ISpeedCalculation,
  positions: IAisPosition[],
  shipData: IShipData,
): Promise<IFuelConsumption> => {
  const preFuelCalculation = await perCalculateSecondFormulaFuel(
    speedData,
    positions,
    shipData,
  );
  const fuelEstimateME =
    (preFuelCalculation.bhpMCR *
      shipData.engineSpecs.mainEngine.engine.specificFuelOilConsumption *
      preFuelCalculation.frictionResistance.newTime) /
    1000000;
  const fuelEstimateAE =
    (1.5103 *
      Math.exp(
        -0.064 * preFuelCalculation.frictionResistance.newSpeed.speedKnot,
      ) *
      shipData.fuelType.fuelDensity) /
    1000;

  const fuelData = getFuelByNavStatus(
    positions[1].navstatus,
    fuelEstimateME,
    fuelEstimateAE,
  );
  const totalFuelConsumptionTon = fuelData.totalME + fuelData.totalAE;

  return {
    fuelConsumptionMeTon: fuelData.totalME,
    fuelConsumptionAeTon: fuelData.totalAE,
    totalFuelConsumptionTon,
  };
};
