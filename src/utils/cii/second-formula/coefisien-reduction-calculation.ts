import { IShipSize } from '../../../models/ships/Size';
import { IWindCourse } from '../../../types/second-formula.types';
import { calculateDisplacement } from './size-calculation';

const calculateFN = (vesselSpeed: number, lwl: number): number => {
  return vesselSpeed / Math.sqrt(9.81 * lwl);
};

const calculateSpeedReductionCoef = (
  sizeData: IShipSize,
  vesselSpeed: number,
): number => {
  const fn = calculateFN(vesselSpeed, sizeData.lwl);
  const cb = sizeData.cb;

  if (cb >= 0.55 && cb < 0.6) return 1.7 - 1.4 * fn - 7.4 * Math.pow(fn, 2);
  if (cb >= 0.6 && cb < 0.65) return 2.2 - 2.5 * fn - 9.7 * Math.pow(fn, 2);
  if (cb >= 0.65 && cb < 0.7) return 2.6 - 3.7 * fn - 11.6 * Math.pow(fn, 2);
  if (cb >= 0.7 && cb < 0.75) return 3.1 - 5.3 * fn - 12.4 * Math.pow(fn, 2);
  if (cb >= 0.75 && cb < 0.8) return 2.4 - 10.6 * fn - 9.5 * Math.pow(fn, 2);
  if (cb >= 0.8 && cb < 0.85) return 2.6 - 13.1 * fn - 15.1 * Math.pow(fn, 2);
  if (cb >= 0.85 && cb < 0.9) return 3.1 - 18.7 * fn + 28 * Math.pow(fn, 2);
  return 0;
};

const calculateWindCourseRedCoef = (windCourse: IWindCourse): number => {
  const angle = windCourse.encounteredAngle;
  const beafortNumber = windCourse.beafortNumber;

  if (angle >= 0 && angle <= 30) return 2 / 2;
  if (angle > 30 && angle <= 60)
    return (1.7 - 0.03 * Math.pow(beafortNumber - 4, 2)) / 2;
  if (angle > 60 && angle <= 150)
    return (0.9 - 0.06 * Math.pow(beafortNumber - 6, 2)) / 2;
  if (angle > 150 && angle <= 180)
    return (0.4 - 0.03 * Math.pow(beafortNumber - 8, 2)) / 2;
  return 0;
};

const calculateShipShapeCoef = (
  windCourse: IWindCourse,
  sizeData: IShipSize,
): number => {
  const displacement = calculateDisplacement(sizeData);

  return (
    (0.7 * windCourse.beafortNumber + Math.pow(windCourse.beafortNumber, 6.5)) /
    (2.2 * Math.pow(displacement, 2 / 3))
  );
};

export const calculateCoefisienReduction = (
  windCourse: IWindCourse,
  vesselSpeed: number,
  sizeData: IShipSize,
): number => {
  const speedReductionCoef = calculateSpeedReductionCoef(sizeData, vesselSpeed);
  const shipShapeCoef = calculateShipShapeCoef(windCourse, sizeData);
  const windCourseRedCoef = calculateWindCourseRedCoef(windCourse);
  return speedReductionCoef * shipShapeCoef * windCourseRedCoef;
};
