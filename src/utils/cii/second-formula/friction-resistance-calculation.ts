import { ISpeedCalculation, ISpeed } from '../../../types/second-formula.types';
import { IShipSize } from '../../../models/ships/Size';

const calculateNewSpeed = (vesselSpeed: ISpeed, coefRed: number): ISpeed => {
  const speedKnot = vesselSpeed.speedKnot / (1 - 0.01 * coefRed);
  const speedMs = speedKnot * 0.5144;
  return { speedMs, speedKnot };
};

const calculateNewFn = (vesselSpeedMS: number, lwl: number): number => {
  return vesselSpeedMS / Math.sqrt(9.81 * lwl);
};

const calculateNewTime = (newSpeed: ISpeed, distance: number): number => {
  return distance / newSpeed.speedKnot;
};

const calculateRenouldNumber = (
  sizeData: IShipSize,
  newSpeed: ISpeed,
): number => {
  return (sizeData.lwl * newSpeed.speedMs) / 0.000001188;
};

const calculateSaap = (sizeData: IShipSize) => {
  return (
    sizeData.c1 *
    sizeData.c2 *
    sizeData.c3 *
    sizeData.c5 *
    ((1.75 * sizeData.lwl * sizeData.t) / 100)
  );
};

export const calculateFrictionResistance = (
  vesselSpeed: ISpeedCalculation,
  coefRed: number,
  sizeData: IShipSize,
): {
  newSpeed: ISpeed;
  newFn: number;
  newTime: number;
  Saap: number;
  onePlusK2: number;
  Raap: number;
  Rf: number;
} => {
  const newSpeed = calculateNewSpeed(vesselSpeed, coefRed);
  const newFn = calculateNewFn(newSpeed.speedMs, sizeData.lwl);
  const newTime = calculateNewTime(newSpeed, vesselSpeed.distance);
  const renouldNumber = calculateRenouldNumber(sizeData, newSpeed);
  const cf = 0.075 / Math.pow(Math.log10(renouldNumber) - 2, 2);
  const Saap = calculateSaap(sizeData);
  const onePlusK2 = 4.3;
  const Raap =
    0.5 * 1024 * Math.pow(newSpeed.speedMs, 2) * cf * Saap * onePlusK2;

  const Rf =
    0.5 *
    1024 *
    cf *
    (sizeData.b / sizeData.t) *
    (newSpeed.speedMs * newSpeed.speedMs);
  return {
    newSpeed,
    newFn,
    newTime,
    Saap,
    onePlusK2,
    Raap,
    Rf,
  };
};
