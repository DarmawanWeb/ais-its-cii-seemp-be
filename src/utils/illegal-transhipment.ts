import { IAisPosition, IAis } from '../models/Ais';
import { calculateDistance } from './cii/speed-calculation';

export const isInBatamBounds = (lat: number, long: number): boolean => {
  const latTop = 3.0372;
  const latBottom = -0.89028;
  const longLeft = 103.97159;
  const longRight = 109.22838;

  return (
    lat >= latBottom && lat <= latTop && long >= longLeft && long <= longRight
  );
};

function checkSpeed(currentShip: IAisPosition, ship: IAisPosition): number {
  const speedDifference = Math.abs(ship.sog - currentShip.sog);
  if (speedDifference < 0.5) return 3;
  if (speedDifference >= 0.5 && speedDifference < 2) return 2;
  if (speedDifference >= 2 && speedDifference <= 10) return 1;
  return 0;
}

function checkLocation(currentShip: IAisPosition, ship: IAisPosition): number {
  const { distanceInMeters } = calculateDistance(currentShip, ship);
  if (distanceInMeters <= 27) return 3;
  if (distanceInMeters > 27 && distanceInMeters <= 34) return 2;
  if (distanceInMeters > 34 && distanceInMeters <= 600) return 1;
  return 0;
}

function checkHeading(currentShip: IAisPosition, ship: IAisPosition): number {
  const headingDifference = Math.abs(currentShip.hdg - ship.hdg);
  const normalizedHeadingDifference =
    headingDifference > 180 ? 360 - headingDifference : headingDifference;

  if (normalizedHeadingDifference <= 6) return 3;
  if (normalizedHeadingDifference > 6 && normalizedHeadingDifference <= 174)
    return 2;
  if (normalizedHeadingDifference > 174 && normalizedHeadingDifference <= 186)
    return 1;
  return 0;
}

export function checkIlegalTranshipmentPossibility(
  currentShip: IAisPosition,
  shipsArray: IAis[],
): { mmsi: string; priority: number }[] {
  const result: { mmsi: string; priority: number }[] = [];

  shipsArray.forEach((ship) => {
    const position: IAisPosition = ship.positions[0];

    const speedPriority = checkSpeed(currentShip, position);
    const locationPriority = checkLocation(currentShip, position);
    const headingPriority = checkHeading(currentShip, position);

    const totalPriority = speedPriority * locationPriority * headingPriority;

    if (totalPriority > 0) {
      result.push({ mmsi: ship.mmsi, priority: totalPriority });
    }
  });

  return result;
}
