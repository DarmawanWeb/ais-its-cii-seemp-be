import { ICurrentWeather } from '../weather';
import { ILocation } from '../../../types/ais.type';
import { IWindCourse } from '../../../types/second-formula.types';

const calculateBeafortNumber = (windSpeed: number): number => {
  if (windSpeed <= 0.6) {
    return 0;
  } else if (windSpeed <= 3) {
    return 1;
  } else if (windSpeed <= 6.4) {
    return 2;
  } else if (windSpeed <= 10.6) {
    return 3;
  } else if (windSpeed <= 15.5) {
    return 4;
  } else if (windSpeed <= 21) {
    return 5;
  } else if (windSpeed <= 26.9) {
    return 6;
  } else if (windSpeed <= 33.4) {
    return 7;
  } else {
    return 8;
  }
};

const calculateEncountedAngle = (
  shipCourse: number,
  windCourse: number,
): number => {
  if (
    shipCourse <= windCourse &&
    windCourse > shipCourse &&
    windCourse - shipCourse <= 180
  ) {
    return windCourse - shipCourse;
  } else if (
    shipCourse <= windCourse &&
    windCourse > shipCourse &&
    windCourse - shipCourse > 180
  ) {
    return 360 - windCourse + shipCourse;
  } else if (shipCourse <= 180 && windCourse < shipCourse) {
    return shipCourse - windCourse;
  } else if (
    shipCourse > 180 &&
    windCourse < shipCourse &&
    shipCourse - windCourse <= 180
  ) {
    return shipCourse - windCourse;
  } else if (
    shipCourse > 180 &&
    windCourse < shipCourse &&
    shipCourse - windCourse > 180
  ) {
    return 360 - shipCourse + windCourse;
  } else if (shipCourse > 180 && windCourse > shipCourse) {
    return windCourse - shipCourse;
  } else {
    return 0;
  }
};

export const calculateWindCourse = (
  shipCourse: number,
  windData: ICurrentWeather,
): IWindCourse => {
  const beafortNumber = calculateBeafortNumber(windData.windspeed);
  const encounteredAngle = calculateEncountedAngle(
    shipCourse,
    windData.winddirection,
  );
  return {
    beafortNumber,
    encounteredAngle,
  };
};

export const calculateShipCourse = (
  firstPosition: ILocation,
  secondPosition: ILocation,
): number => {
  const dLat = Math.log(
    Math.tan(secondPosition.lat / 2 + Math.PI / 4) /
      Math.tan(firstPosition.lat / 2 + Math.PI / 4),
  );
  const dLong = Math.abs(firstPosition.lon - secondPosition.lon);
  const bearing = Math.atan2(dLong, dLat);
  const degrees = (bearing * 180) / Math.PI;
  const deltaLat = secondPosition.lat - firstPosition.lat;
  const deltaLong = secondPosition.lon - firstPosition.lon;

  let result;
  if (deltaLat > 0 && deltaLong > 0) {
    result = degrees;
  } else if (deltaLat < 0 && deltaLong > 0) {
    result = degrees;
  } else if (deltaLat < 0 && deltaLong < 0) {
    result = 360 - degrees;
  } else {
    result = 360 - degrees;
  }
  return result;
};
