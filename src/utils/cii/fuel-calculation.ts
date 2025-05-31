import { IFuel } from '../../models/ships/Fuel';
import { IFirstFuelFormula } from '../../models/ships/FirstFuelFormula';

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
): Promise<{
  fuelEstimateAE: number;
  fuelEstimateME: number;
  fuelConsumptionMeMetricTon: number;
  fuelConsumptionAeMetricTon: number;
  totalFuelEstimate: number;
  estimatedFuelTon: number;
}> => {
  console.log('Calculating first formula fuel...');
  if (!fuelType || !fuelFormulas) {
    console.log(fuelFormulas);
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
    fuelEstimateAE: fuelData.totalAE,
    fuelEstimateME: fuelData.totalME,
    fuelConsumptionMeMetricTon: calculateTotalFuelTon(
      fuelData.totalME,
      fuelType.fuelDensity,
    ),
    fuelConsumptionAeMetricTon: calculateTotalFuelTon(
      fuelData.totalAE,
      fuelType.fuelDensity,
    ),
    totalFuelEstimate,
    estimatedFuelTon: calculateTotalFuelTon(
      totalFuelEstimate,
      fuelType.fuelDensity,
    ),
  };
};
