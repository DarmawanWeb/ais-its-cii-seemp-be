import {
  calculateThirdCiiAndGrade,
  formatCost,
  calculateCostbyPower,
} from './utils';

import { IAnnualCII } from '../../models/cii/AnnualCII';
import { IShipData } from '../../types/ship.type';
import { ISEEMPFormulaResult } from './first-formula';

export const calculateSolarPower = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  shipData: IShipData,
): Promise<ISEEMPFormulaResult> => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateThirdCiiAndGrade(
    ciiRequired,
    annualCII,
    shipData,
    0.12,
  );
  const costPerKw = 3000;
  const cost = calculateCostbyPower(shipData, costPerKw, false);

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};

export const calculateWindPower = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  vesselData: IShipData,
): Promise<ISEEMPFormulaResult> => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateThirdCiiAndGrade(
    ciiRequired,
    annualCII,
    vesselData,
    0.5,
  );
  const costPerKw = 4000;
  const cost = calculateCostbyPower(vesselData, costPerKw, false);

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};

export const calculateColdIroning = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  vesselData: IShipData,
  voyagePerYear: number,
): Promise<ISEEMPFormulaResult> => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateThirdCiiAndGrade(
    ciiRequired,
    annualCII,
    vesselData,
    0.1,
    true,
    voyagePerYear,
  );
  const costPerKw = 0.5;
  const costData = calculateCostbyPower(vesselData, costPerKw, false);
  const cost = costData + 800150;

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};

export const calculateFuelCells = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  vesselData: IShipData,
): Promise<ISEEMPFormulaResult> => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateThirdCiiAndGrade(
    ciiRequired,
    annualCII,
    vesselData,
    0.2,
  );
  const costPerKw = 1780;
  const cost = calculateCostbyPower(vesselData, costPerKw, false);

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};
