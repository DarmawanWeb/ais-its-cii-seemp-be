import {
  calculateSecondCiiAndGrade,
  formatCost,
  calculateCostbyPower,
} from './utils';

import { IAnnualCII } from '../../models/cii/AnnualCII';
import { IShipData } from '../../types/ship.type';
import { ISEEMPFormulaResult } from './first-formula';

export const calculateLNGFuel = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  shipData: IShipData,
): Promise<ISEEMPFormulaResult> => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateSecondCiiAndGrade(
    ciiRequired,
    annualCII,
    shipData,
    2.75,
  );
  const costPerKw = 1580;
  const cost = calculateCostbyPower(shipData, costPerKw);

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};

export const calculateBioFuel = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  shipData: IShipData,
) => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateSecondCiiAndGrade(
    ciiRequired,
    annualCII,
    shipData,
    2.45,
  );
  const costPerKw = 20;
  const cost = calculateCostbyPower(shipData, costPerKw);

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};
