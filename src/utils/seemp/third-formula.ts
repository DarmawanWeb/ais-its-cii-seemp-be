import {
  calculateThirdCiiAndGrade,
  formatCost,
  calculateCostbyPower,
} from './utils';

import { IAnnualCII } from '../../models/cii/AnnualCII';
import { IShipData } from '../../types/ship.type';
import { ISEEMPFormulaResult } from './first-formula';
import { calculateCostPerYear } from './cost-calc';

export const calculateSolarPower = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  shipData: IShipData,
  highestYearZValue: number,
): Promise<ISEEMPFormulaResult> => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateThirdCiiAndGrade(
    ciiRequired,
    annualCII,
    shipData,
    0.12,
    false,
    42
  );
  const costPerKw = 3000;
  const cost = calculateCostbyPower(shipData, costPerKw, false);
  const costPerYear = await calculateCostPerYear(
    shipData.typeData,
    shipData.sizeData.capacity,
    ciiRatingAfter,
    highestYearZValue,
    cost,
  );

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost: costPerYear,
    costDisplay: formatCost(costPerYear),
  };
};

export const calculateWindPower = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  vesselData: IShipData,
  highestYearZValue: number,
): Promise<ISEEMPFormulaResult> => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateThirdCiiAndGrade(
    ciiRequired,
    annualCII,
    vesselData,
    0.15,
  );
  const costPerKw = 4000;
  const cost = calculateCostbyPower(vesselData, costPerKw, false);

  const costPerYear = await calculateCostPerYear(
    vesselData.typeData,
    vesselData.sizeData.capacity,
    ciiRatingAfter,
    highestYearZValue,
    cost,
  );

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost: costPerYear,
    costDisplay: formatCost(costPerYear),
  };
};

export const calculateColdIroning = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  vesselData: IShipData,
  voyagePerYear: number,
  highestYearZValue: number,
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

  const costPerYear = await calculateCostPerYear(
    vesselData.typeData,
    vesselData.sizeData.capacity,
    ciiRatingAfter,
    highestYearZValue,
    cost,
  );

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost : costPerYear,
    costDisplay: formatCost(costPerYear),
  };
};

export const calculateFuelCells = async (
  ciiRequired: number,
  annualCII: IAnnualCII,
  vesselData: IShipData,
  voyagePerYear: number,
): Promise<ISEEMPFormulaResult> => {
  const { ciiRatingAfter, ciiGradeAfter } = calculateThirdCiiAndGrade(
    ciiRequired,
    annualCII,
    vesselData,
    0.2,
  );
  const costPerKw = 1780;
  const cost = calculateCostbyPower(vesselData, costPerKw, false);
  const costPerYear = await calculateCostPerYear(
    vesselData.typeData,
    vesselData.sizeData.capacity,
    ciiRatingAfter,
    voyagePerYear,
    cost,
  );

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost: costPerYear,
    costDisplay: formatCost(costPerYear),
  };
};
