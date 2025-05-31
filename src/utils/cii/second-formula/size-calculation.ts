import { IShipSize } from '../../../models/ships/Size';

export const calculateLengthDisplacement = (sizeData: IShipSize): number => {
  return (sizeData.lwl + sizeData.lpp) / 2;
};

export const calculateDisplacement = (sizeData: IShipSize): number => {
  const lengthDisplacement = calculateLengthDisplacement(sizeData);
  return lengthDisplacement * sizeData.b * sizeData.t * sizeData.cbnsp * 1.025;
};
