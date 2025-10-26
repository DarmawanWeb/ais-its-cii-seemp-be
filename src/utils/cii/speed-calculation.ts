import { type IAisPosition } from '../../models/Ais';
import { ISpeedCalculation } from '../../types/second-formula.types';
import { ILocation } from '../../types/ais.type';

const degreesToRadians = (degrees: number): number => degrees * (Math.PI / 180);

const positionToRadians = (position: IAisPosition): [number, number] => [
  degreesToRadians(position.lat),
  degreesToRadians(position.lon),
];

export const calculateDistance = (
  firstPosition: IAisPosition,
  secondPosition: IAisPosition,
): {
  firstPositionRad: ILocation;
  secondPositionRad: ILocation;
  distance: number;
  distanceInMeters: number;
} => {
  const radiusOfEarth = 3438;
  const [firstLatRad, firstLonRad] = positionToRadians(firstPosition);
  const [secondLatRad, secondLonRad] = positionToRadians(secondPosition);
  const deltaLat = secondLatRad - firstLatRad;
  const deltaLon = secondLonRad - firstLonRad;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(firstLatRad) *
      Math.cos(secondLatRad) *
      Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return {
    firstPositionRad: { lat: firstLatRad, lon: firstLonRad },
    secondPositionRad: { lat: secondLatRad, lon: secondLonRad },
    distance: radiusOfEarth * c,
    distanceInMeters: radiusOfEarth * c * 1852,
  };
};

export const calculateSpeed = (
  lastTwoPosition: IAisPosition[],
): ISpeedCalculation => {
  const data = calculateDistance(lastTwoPosition[0], lastTwoPosition[1]);

  const timeDifference =
    Math.abs(
      Number(lastTwoPosition[0].timestamp) -
        Number(lastTwoPosition[1].timestamp),
    ) / 3600000;

  if (timeDifference === 0) {
    return {
      ...data,
      speedKnot: 0,
      speedMs: 0,
      timeDifferenceHours: 0,
      timeDifferenceMinutes: 0,
    };
  }

  const speedKnot = data.distance / timeDifference;
  const speedKnootNormalized = Math.min(speedKnot, 30);

  const speedMs = speedKnootNormalized * 0.5144;

  return {
    ...data,
    speedKnot: speedKnootNormalized,
    speedMs,
    timeDifferenceHours: timeDifference,
    timeDifferenceMinutes: timeDifference * 60,
  };
};
