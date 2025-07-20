import {
  calculateSecondCiiAndGrade,
  formatCost,
  calculateCostbyPower,
} from './utils';

import { IAnnualCII } from '../../models/cii/AnnualCII';
import { IShipData } from '../../types/ship.type';
import { ISEEMPFormulaResult } from './first-formula';
import { calculateCostPerYear } from './cost-calc';

export const calculateLNGFuel = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  shipData: IShipData,
  higestZValueYear: number,
): Promise<ISEEMPFormulaResult> => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateSecondCiiAndGrade(
    ciiRequired,
    annualCII,
    shipData,
    2.75,
  );
  const costPerKw = 1580;
  const cost = calculateCostbyPower(shipData, costPerKw);
  const costPerYear = await calculateCostPerYear(
    shipData.typeData,
    shipData.sizeData.capacity,
    ciiRatingAfter,
    higestZValueYear,
    cost,
  );

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost : costPerYear,
    costDisplay: formatCost(costPerYear),
  };
};

export const calculateBioFuel = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  shipData: IShipData,
  higestZValueYear: number,
) => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateSecondCiiAndGrade(
    ciiRequired,
    annualCII,
    shipData,
    2.45,
  );
  const costPerKw = 20;
  const cost = calculateCostbyPower(shipData, costPerKw);
  const costPerYear = await calculateCostPerYear(
    shipData.typeData,
    shipData.sizeData.capacity,
    ciiRatingAfter,
    higestZValueYear,
    cost,
  );
  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost: costPerYear,
    costDisplay: formatCost(costPerYear),
  };
};
