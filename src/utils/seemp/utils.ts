import { assignGradeBasedOnDdVector } from '../cii/cii-calculation';
import { IShipData } from '../../types/ship.type';
import { IAnnualCII } from '../../models/cii/AnnualCII';

export interface ICalculateResult {
  ciiRatingAfter: number;
  ciiGradeAfter: string;
}

export const calculateFirstCiiAndGrade = (
  ciiRequired: number,
  ciiAttained: number,
  voyagePerYear: number,
  shipData: IShipData,
  potentialCiiReduce: number,
): ICalculateResult => {
  const ciiAttainedAfter =
    ciiAttained -
    (((ciiAttained * potentialCiiReduce) / 100) * voyagePerYear) / 100;
  const ciiRatingAfter = ciiAttainedAfter / ciiRequired;

  const ciiGradeAfter = assignGradeBasedOnDdVector(
    shipData.typeData.d,
    ciiRatingAfter,
  );

  return { ciiRatingAfter, ciiGradeAfter };
};

export const calculateSecondCiiAndGrade = (
  ciiRequired: number,
  annualCII: IAnnualCII,
  shipData: IShipData,
  fuelFactor: number,
): ICalculateResult => {
  const ciiAttainedAfter =
    (((annualCII.cii[0].cii.fuelConsumption.fuelConsumptionMeTon +
      annualCII.cii[0].cii.fuelConsumption.fuelConsumptionAeTon) *
      fuelFactor) /
      (annualCII.cii[0].cii.totalDistance * shipData.sizeData.capacity)) *
    10 ** 6;

  return {
    ciiRatingAfter: ciiAttainedAfter / ciiRequired,
    ciiGradeAfter: assignGradeBasedOnDdVector(
      shipData.typeData.d,
      ciiAttainedAfter / ciiRequired,
    ),
  };
};

export const calculateThirdCiiAndGrade = (
  ciiRequired: number,
  annualCII: IAnnualCII,
  shipData: IShipData,
  potentialCiiReduce: number,
  isColdIrroning: boolean = false,
  voyagePerYear: number = 0,
): ICalculateResult => {
  const fuelAe =
    annualCII.cii[0].cii.fuelConsumption.fuelConsumptionAeTon *
    (1 - voyagePerYear / 100);

  const totalFuelAe = isColdIrroning
    ? fuelAe +
      (annualCII.cii[0].cii.fuelConsumption.fuelConsumptionAeTon *
        voyagePerYear *
        0.8) /
        100
    : annualCII.cii[0].cii.fuelConsumption.fuelConsumptionMeTon *
      (1 - potentialCiiReduce);

  const totalFuel =
    totalFuelAe + annualCII.cii[0].cii.fuelConsumption.fuelConsumptionMeTon;

  const ciiAttainedAfter =
    ((totalFuel * shipData.fuelType.conversionFactor) /
      (annualCII.cii[0].cii.totalDistance * shipData.sizeData.capacity)) *
    10 ** 6;

  return {
    ciiRatingAfter: ciiAttainedAfter / ciiRequired,
    ciiGradeAfter: assignGradeBasedOnDdVector(
      shipData.typeData.d,
      ciiAttainedAfter / ciiRequired,
    ),
  };
};

export const formatCost = (cost: number): string => {
  const costData = Number(cost.toFixed(0));
  return `$${costData.toLocaleString()}`;
};

export const calculateCostbyPower = (
  shipData: IShipData,
  costPerKw: number,
  useMe = true,
): number => {
  const totalPowerAE =
    shipData.engineSpecs.auxiliaryEngine.engine[0].power *
    shipData.engineSpecs.auxiliaryEngine.quantity;

  const totalPowerME = useMe
    ? shipData.engineSpecs.mainEngine.engine.power *
      shipData.engineSpecs.mainEngine.quantity
    : 0;

  const cost = (totalPowerAE + totalPowerME) * costPerKw;

  return cost;
};
