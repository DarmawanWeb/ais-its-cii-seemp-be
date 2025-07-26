import { ISecondaryShip } from '../models/SecondaryShip';
import { ILocation } from './ais.type';

export interface IShipData extends ISecondaryShip {
  positions: ILocation[];
  foto?: string;
}

export interface IWindCourse {
  encounteredAngle: number;
  beafortNumber: number;
}

export interface ISpeedCalculation {
  firstPositionRad: ILocation;
  secondPositionRad: ILocation;
  distance: number;
  speedKnot: number;
  speedMs: number;
  timeDifferenceHours: number;
  timeDifferenceMinutes: number;
}

export interface IFrictionResistance {
  newSpeed: ISpeed;
  newFn: number;
  newTime: number;
  Saap: number;
  onePlusK2: number;
  Raap: number;
  Rf: number;
}

export interface ISpeed {
  speedKnot: number;
  speedMs: number;
}

export interface ITotalResistance {
  rt: number;
  rtPlusSm: number;
}

export interface IDdVector {
  d1: number;
  d2: number;
  d3: number;
  d4: number;
}

export interface IFuelConsumption {
  fuelConsumptionMeTon: number;
  fuelConsumptionAeTon: number;
  totalFuelConsumptionTon: number;
}

export interface ICIICalculation {
  notes?: string;
  ciiRequired: number;
  ciiAttained: number;
  ciiRating: number;
  ciiGrade: string;
  totalDistance: number;
  fuelConsumption: IFuelConsumption;
}

export interface IDdVector {
  d1: number;
  d2: number;
  d3: number;
  d4: number;
}

export interface IAnnualCIIWithDDVector {
  year: number;
  ciiRequired: number;
  ciiAttained: number;
  ciiRating: number;
  ciiGrade: string;
  totalDistance: number;
  ddVector: IDdVector;
}

export interface IPreCalculateSecondFormulaFuel {
  bhpMCR: number;
  frictionResistance: IFrictionResistance;
}

export type ICIIGrafik = {
  ciiData: {
    ciiAttained: number;
    timestamp: string;
    ciiRequired?: number;
  }[];
  ddVector?: IDdVector;
};
