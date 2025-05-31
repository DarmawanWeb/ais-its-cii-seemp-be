import { ILocation } from './ais.type';
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

export interface IFuelConsumption {
  fuelConsumptionMeTon: number;
  fuelConsumptionAeTon: number;
  totalFuelConsumptionTon: number;
}
