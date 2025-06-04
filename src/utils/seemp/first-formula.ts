import { calculateS } from '../cii/second-formula/total-resistance-calculation';
import { IShipData } from '../../types/ship.type';
import {
  calculateFirstCiiAndGrade,
  formatCost,
  calculateCostbyPower,
} from './utils';

export interface ISEEMPFormulaResult {
  ciiRatingAfter: number;
  ciiGradeAfter: string;
  cost: number;
  costDisplay: string;
}

export const calculateAirLubrication = (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  shipData: IShipData,
): ISEEMPFormulaResult => {
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

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};

export const calculateHullCoating = (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  shipData: IShipData,
): ISEEMPFormulaResult => {
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

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};

export const calculatePowerSystemMachinery = (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  vesselData: IShipData,
): ISEEMPFormulaResult => {
  const potentialCiiReduce = 18;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    vesselData,
    potentialCiiReduce,
  );

  // Assuming the cost calculation logic is yet to be defined, we'll use a placeholder
  const cost = 0;

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};

export const calculatePropEffDevice = (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  vesselData: IShipData,
): ISEEMPFormulaResult => {
  const potentialCiiReduce = 13;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    vesselData,
    potentialCiiReduce,
  );

  const cost = 400000; // Assuming this is a fixed cost as per the original function

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: '$100,000 - $800,000',
  };
};

export const calculateResistanceReduceDevice = (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  vesselData: IShipData,
): ISEEMPFormulaResult => {
  const potentialCiiReduce = 9;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    vesselData,
    potentialCiiReduce,
  );

  const cost = 500000;

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: '$300,000 - $700,000',
  };
};

export const calculateWasteHeatRecovery = (
  voyagePerYear: number,
  ciiRequired: number,
  ciiAttained: number,
  vesselData: IShipData,
): ISEEMPFormulaResult => {
  const potentialCiiReduce = 10;
  const { ciiRatingAfter, ciiGradeAfter } = calculateFirstCiiAndGrade(
    ciiRequired,
    ciiAttained,
    voyagePerYear,
    vesselData,
    potentialCiiReduce,
  );

  const cost = calculateCostbyPower(vesselData, 100);

  return {
    ciiRatingAfter,
    ciiGradeAfter,
    cost,
    costDisplay: formatCost(cost),
  };
};
