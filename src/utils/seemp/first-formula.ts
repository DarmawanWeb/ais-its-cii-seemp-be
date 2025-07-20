import { calculateS } from '../cii/second-formula/total-resistance-calculation';
import { IShipData } from '../../types/ship.type';
import {
  calculateFirstCiiAndGrade,
  formatCost,
  calculateCostbyPower,
} from './utils';
import { calculateCostPerYear } from './cost-calc';

export interface ISEEMPFormulaResult {
  ciiRatingAfter: number;
  ciiGradeAfter: string;
  cost: number;
  costDisplay: string;
}

export const calculateAirLubrication = async (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  shipData: IShipData,
  highestYearZValue: number,
): Promise<ISEEMPFormulaResult> => {
  const potentialCiiReduce = 8;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    shipData,
    potentialCiiReduce,
  );

  const LOA = shipData.sizeData.loa;
  let cost;
  if (LOA <= 100) {
    cost = 430000;
  } else if (LOA > 100 && LOA <= 200) {
    cost = 850000;
  } else {
    cost = 1280000;
  }

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

export const calculateHullCoating = async (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  shipData: IShipData,
  highestYearZValue: number,
): Promise<ISEEMPFormulaResult> => {
  const potentialCiiReduce = 10;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    shipData,
    potentialCiiReduce,
  );

  const S = calculateS(shipData.sizeData);
  const cost = S * 100;

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

export const calculatePowerSystemMachinery = async (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  vesselData: IShipData,
  highestYearZValue: number,
): Promise<ISEEMPFormulaResult> => {
  const potentialCiiReduce = 18;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    vesselData,
    potentialCiiReduce,
  );

  const cost = calculateCostbyPower(
    vesselData,
    500,
    true, 
    false
  );

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

export const calculatePropEffDevice = async (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  vesselData: IShipData,
  highestYearZValue: number,
): Promise<ISEEMPFormulaResult> => {
  const potentialCiiReduce = 13;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    vesselData,
    potentialCiiReduce,
  );


  const costPerYearHigh = await calculateCostPerYear(
    vesselData.typeData,
    vesselData.sizeData.capacity,
    ciiRatingAfter,
    highestYearZValue,
    800000,
  );

  const costPerYearLow = await calculateCostPerYear(
    vesselData.typeData,
    vesselData.sizeData.capacity,
    ciiRatingAfter,
    highestYearZValue,
    100000,
  );


  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost: (costPerYearHigh + costPerYearLow) / 2,
    costDisplay: `${formatCost(costPerYearLow)} - ${formatCost(costPerYearHigh)}`,
  };
};

export const calculateResistanceReduceDevice = async (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  vesselData: IShipData,
  highestYearZValue: number,
): Promise<ISEEMPFormulaResult> => {
  const potentialCiiReduce = 9;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    vesselData,
    potentialCiiReduce,
  );


  const costPerYearHigh = await calculateCostPerYear(
    vesselData.typeData,
    vesselData.sizeData.capacity,
    ciiRatingAfter,
    highestYearZValue,
    700000,
  );

  const costPerYearLow = await calculateCostPerYear(
    vesselData.typeData,
    vesselData.sizeData.capacity,
    ciiRatingAfter,
    highestYearZValue,
    300000,
  );

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost: (costPerYearHigh + costPerYearLow) / 2,
    costDisplay: `${formatCost(costPerYearLow)} - ${formatCost(costPerYearHigh)}`,
  };
};

export const calculateWasteHeatRecovery = async (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  vesselData: IShipData,
  highestYearZValue: number,
): Promise<ISEEMPFormulaResult> => {
  const potentialCiiReduce = 10;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    vesselData,
    potentialCiiReduce,
  );

  const cost = calculateCostbyPower(vesselData, 100);

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
    costDisplay: formatCost(cost),
  };
};