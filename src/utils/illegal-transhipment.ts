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

    if (!position) return;

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

function interpolatePositions(
  ship1: IAisPosition,
  ship2: IAisPosition,
  targetTime: Date,
): IAisPosition {
  const time1 = new Date(ship1.timestamp).getTime();
  const time2 = new Date(ship2.timestamp).getTime();
  const targetTimeMs = targetTime.getTime();

  const timeDiff = time2 - time1;
  const ratio = (targetTimeMs - time1) / timeDiff;

  const interpolate = (start: number, end: number) =>
    start + (end - start) * ratio;

  return {
    ...ship1,
    lat: interpolate(ship1.lat, ship2.lat),
    lon: interpolate(ship1.lon, ship2.lon),
    sog: interpolate(ship1.sog, ship2.sog),
    hdg: interpolate(ship1.hdg, ship2.hdg),
    timestamp: targetTime,
  };
}

function getPositionAtTime(
  route: IAisPosition[],
  targetTime: Date,
): IAisPosition | null {
  const targetTimeMs = targetTime.getTime();

  const exactMatch = route.find(
    (pos) => new Date(pos.timestamp).getTime() === targetTimeMs,
  );
  if (exactMatch) return exactMatch;

  let prevPos: IAisPosition | null = null;
  let nextPos: IAisPosition | null = null;

  for (let i = 0; i < route.length; i++) {
    const posTime = new Date(route[i].timestamp).getTime();

    if (posTime < targetTimeMs) {
      prevPos = route[i];
    } else if (posTime > targetTimeMs) {
      nextPos = route[i];
      break;
    }
  }

  if (prevPos && nextPos) {
    return interpolatePositions(prevPos, nextPos, targetTime);
  }

  return null;
}

interface IllegalTranshipmentResult {
  isIllegal: boolean;
  startTimestamp?: Date;
  endTimestamp?: Date;
  accuracy?: number;
}

export async function detectIllegalTranshipment(
  route1: IAisPosition[],
  route2: IAisPosition[],
  checkDuration: number = 30 * 60 * 1000,
): Promise<IllegalTranshipmentResult> {
  const startTime = Math.min(
    new Date(route1[0].timestamp).getTime(),
    new Date(route2[0].timestamp).getTime(),
  );

  const endTime = Math.max(
    new Date(route1[route1.length - 1].timestamp).getTime(),
    new Date(route2[route2.length - 1].timestamp).getTime(),
  );

  let currentWindowStart = startTime;

  while (currentWindowStart + checkDuration <= endTime) {
    let possibilityCount = 0;
    let totalChecks = 0;

    let currentTime = new Date(currentWindowStart);
    const windowEnd = currentWindowStart + checkDuration;

    while (currentTime.getTime() < windowEnd) {
      const ship1Position = getPositionAtTime(route1, currentTime);
      const ship2Position = getPositionAtTime(route2, currentTime);

      if (ship1Position && ship2Position) {
        totalChecks++;

        const speedPriority = checkSpeed(ship1Position, ship2Position);
        const locationPriority = checkLocation(ship1Position, ship2Position);
        const headingPriority = checkHeading(ship1Position, ship2Position);

        const totalPriority =
          speedPriority * locationPriority * headingPriority;

        if (totalPriority > 0) {
          possibilityCount++;
        }
      }

      currentTime = new Date(currentTime.getTime() + 1 * 60 * 1000);
    }

    if (totalChecks > 0) {
      const possibilityPercentage = (possibilityCount / totalChecks) * 100;

      if (possibilityPercentage >= 80) {
        return {
          isIllegal: true,
          startTimestamp: new Date(currentWindowStart),
          endTimestamp: new Date(windowEnd),
          accuracy: Math.round(possibilityPercentage * 100) / 100,
        };
      }
    }

    currentWindowStart += 1 * 60 * 1000;
  }

  return {
    isIllegal: false,
  };
}
