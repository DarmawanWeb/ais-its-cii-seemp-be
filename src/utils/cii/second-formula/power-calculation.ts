import type { IShipSize } from '../../../models/ships/Size';
import type {
  IFrictionResistance,
  ITotalResistance,
} from '../../../types/second-formula.types';

const calculateW = (sizeData: IShipSize): number => {
  return 0.5 * sizeData.cb - 0.05;
};

const calculateEHP = (
  frictionResistance: IFrictionResistance,
  totalResis: ITotalResistance,
) => {
  return frictionResistance.newSpeed.speedMs * totalResis.rtPlusSm;
};

const calculateDHP = (
  frictionResistance: IFrictionResistance,
  totalResis: ITotalResistance,
  sizeData: IShipSize,
): number => {
  const ehp = calculateEHP(frictionResistance, totalResis);
  const w = calculateW(sizeData);
  const t = w * 0.9;
  const nh = (1 - t) / (1 - w);
  const pc = 0.96 * 0.42 * nh;
  return ehp / pc;
};

const calculateSHP = (
  frictionResistance: IFrictionResistance,
  totalResis: ITotalResistance,
  sizeData: IShipSize,
): number => {
  const dhp = calculateDHP(frictionResistance, totalResis, sizeData);
  return dhp / 0.98;
};

export const calculateBHPMCR = (
  frictionResistance: IFrictionResistance,
  totalResis: ITotalResistance,
  sizeData: IShipSize,
): number => {
  const shp = calculateSHP(frictionResistance, totalResis, sizeData);
  return shp / 0.98 / 0.85;
};
