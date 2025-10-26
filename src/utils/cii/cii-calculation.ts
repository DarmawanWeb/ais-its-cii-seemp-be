import { ZValueRepository } from '../../repositories/cii/zvalue.repository';
import { IShipType } from '../../models/ships/Type';
import type {
  IDdVector,
  ICIICalculation,
  IFuelConsumption,
} from '../../types/second-formula.types';
import { IShipData } from '../../types/ship.type';

const zValueRepository = new ZValueRepository();
export const assignGradeBasedOnDdVector = (
  ddVector: IDdVector,
  ciiRating: number,
): string => {
  const { d1, d2, d3, d4 } = ddVector;
  if (ciiRating < d1) {
    return 'A';
  } else if (ciiRating >= d1 && ciiRating < d2) {
    return 'B';
  } else if (ciiRating >= d2 && ciiRating < d3) {
    return 'C';
  } else if (ciiRating >= d3 && ciiRating < d4) {
    return 'D';
  } else {
    return 'E';
  }
};

export const assignGradeBasedOnDdVectorNew = (
  ddVector: IDdVector,
  ciiAttained: number,
  ciiRequired: number,
): string => {
  let { d1, d2, d3, d4 } = ddVector;
  d1 = d1 * ciiRequired;
  d2 = d2 * ciiRequired;
  d3 = d3 * ciiRequired;
  d4 = d4 * ciiRequired;

  console.log(
    `CII Attained: ${ciiAttained}, CII Required: ${ciiRequired}, D1: ${d1}, D2: ${d2}, D3: ${d3}, D4: ${d4}`,
  );
  if (ciiAttained < d1) {
    return 'A';
  } else if (ciiAttained >= d1 && ciiAttained < d2) {
    return 'B';
  } else if (ciiAttained >= d2 && ciiAttained < d3) {
    return 'C';
  } else if (ciiAttained >= d3 && ciiAttained < d4) {
    return 'D';
  } else {
    return 'E';
  }
};

export const calculateCIIRequired = async (
  shipType: IShipType,
  capacity: number,
  year: number | null = null,
): Promise<number> => {
  let currentYear = new Date().getFullYear();
  if (year) {
    currentYear = year;
  }
  const zValue = await zValueRepository.getValueByYear(currentYear);
  if (!zValue) {
    throw new Error('Z value not found for the given year');
  }
  const CIref = shipType.a * capacity ** -shipType.c;
  const ciiRequired = (1 - zValue.zValue / 100) * CIref;
  return ciiRequired;
};

export const calculateCII = async (
  vesselData: IShipData,
  totalFuelConsumptionTon: IFuelConsumption,
  distance: number,
  lastCii: ICIICalculation | null,
): Promise<ICIICalculation> => {
  let ciiAttained = 0;
  let accumulatedDistance = 0;
  let accumulatedFuel = 0;
  const ciiRequired = await calculateCIIRequired(
    vesselData.typeData,
    vesselData.sizeData.capacity,
  );
  if (
    lastCii?.ciiRating !== null &&
    lastCii?.ciiRating !== undefined &&
    lastCii?.totalDistance !== null &&
    lastCii?.fuelConsumption?.totalFuelConsumptionTon !== undefined
  ) {
    accumulatedDistance = (lastCii.totalDistance ?? 0) + distance;
    accumulatedFuel =
      lastCii.fuelConsumption.totalFuelConsumptionTon +
      totalFuelConsumptionTon.totalFuelConsumptionTon;

    ciiAttained =
      ((accumulatedFuel * vesselData.fuelType.conversionFactor) /
        (accumulatedDistance * vesselData.sizeData.capacity)) *
      10 ** 6;
  } else {
    accumulatedDistance = distance;
    accumulatedFuel = totalFuelConsumptionTon.totalFuelConsumptionTon;
    ciiAttained =
      ((totalFuelConsumptionTon.totalFuelConsumptionTon *
        vesselData.fuelType.conversionFactor) /
        (distance * vesselData.sizeData.capacity)) *
      10 ** 6;
  }

  const ciiRating = ciiAttained / ciiRequired;
  const ciiGrade = assignGradeBasedOnDdVector(vesselData.typeData.d, ciiRating);

  return {
    notes: lastCii?.notes ?? '',
    ciiRequired,
    ciiAttained,
    ciiRating,
    ciiGrade,
    totalDistance: accumulatedDistance,
    fuelConsumption: {
      fuelConsumptionMeTon:
        totalFuelConsumptionTon.fuelConsumptionMeTon +
        (lastCii?.fuelConsumption.fuelConsumptionMeTon ?? 0),
      fuelConsumptionAeTon:
        totalFuelConsumptionTon.fuelConsumptionAeTon +
        (lastCii?.fuelConsumption.fuelConsumptionAeTon ?? 0),
      totalFuelConsumptionTon: accumulatedFuel,
    },
  };
};
