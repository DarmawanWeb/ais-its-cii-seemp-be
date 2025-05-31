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

export interface ISpeed {
  speedKnot: number;
  speedMs: number;
}
