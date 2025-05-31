import { calculateLengthDisplacement } from './size-calculation';
import { IShipSize } from '../../../models/ships/Size';
import {
  IFrictionResistance,
  ITotalResistance,
} from '../../../types/second-formula.types';

const calculateLCB = (sizeData: IShipSize): number => {
  const lengthDisplacement = calculateLengthDisplacement(sizeData);
  return (lengthDisplacement * 0.25) / 100;
};

const calculateLr = (sizeData: IShipSize): number => {
  const lcb = calculateLCB(sizeData);
  return (
    sizeData.lpp *
    (1 - sizeData.cp + 0.06 * sizeData.cp * (lcb / (4 * sizeData.cp - 1)))
  );
};

const calculateIE = (sizeData: IShipSize): number => {
  const lr = calculateLr(sizeData);
  const { lwl, b, t, cb, cwp, cp } = sizeData;

  return (
    1 +
    89 *
      Math.exp(
        -(
          (lwl / b) ** 0.80856 *
          (1 - cwp) ** 0.30484 *
          (1 - cp - 0.0225 * calculateLCB(sizeData)) ** 0.6367 *
          (lr / b) ** 0.34574 *
          ((100 * t * lwl * b * cb) / lwl ** 3) ** 0.16302
        ),
      )
  );
};

const calculateC1 = (sizeData: IShipSize, c7: number): number => {
  const ie = calculateIE(sizeData);
  return (
    2223105 *
    Math.pow(c7, 3.78613) *
    Math.pow(sizeData.t / sizeData.b, 1.07961) *
    Math.pow(90 - ie, -1.37565)
  );
};

const calculateC2 = (sizeData: IShipSize): number => {
  return Math.exp(-1.89 * Math.sqrt(sizeData.c3));
};

const calculateC4 = (sizeData: IShipSize): number => {
  const TFDivL = sizeData.t / sizeData.lwl;
  return TFDivL <= 0.04 ? TFDivL : 0.04;
};

const calculateC5 = (sizeData: IShipSize): number => {
  const { b, cb, cm } = sizeData;
  return 1 - (0.8 * 0) / (b * cb * cm);
};

const calculateC15 = (sizeData: IShipSize): number => {
  const lengthDisplacement = calculateLengthDisplacement(sizeData);
  const VDisplacement =
    sizeData.b * sizeData.t * sizeData.cb * lengthDisplacement;
  const L3DivVDisp = Math.pow(sizeData.lwl, 3) / VDisplacement;
  const LDivCubeRootVDisp = sizeData.lwl / Math.cbrt(VDisplacement);

  if (L3DivVDisp <= 512) {
    return -1.69385;
  } else if (L3DivVDisp >= 1727) {
    return L3DivVDisp;
  } else if (L3DivVDisp > 512 && L3DivVDisp < 1727) {
    return -1.69385 + (LDivCubeRootVDisp - 8) / 2.36;
  }
  return 0;
};

const calculateC7 = (sizeData: IShipSize): number => {
  const { b, lwl, t } = sizeData;
  const BdivLwl = b / lwl;
  const BdivT = b / t;

  if (BdivLwl <= 0.11) {
    return 0.229577 * Math.pow(BdivLwl, 0.33333);
  } else if (BdivLwl > 0.11 && BdivLwl < 0.25) {
    return BdivLwl;
  } else if (BdivLwl >= 0.25) {
    return 0.5 - 0.0625 * BdivT;
  }
  return 0;
};

const calculateC16 = (sizeData: IShipSize): number => {
  const { cp } = sizeData;

  if (cp < 0.8) {
    return (
      8.07981 * cp - 13.8673 * Math.pow(cp, 2) + 6.984388 * Math.pow(cp, 3)
    );
  } else if (cp > 0.8) {
    return 1.73014 - 0.7067 * cp;
  }
  return 0;
};

const calculateM1 = (sizeData: IShipSize): number => {
  const { lwl, t, cb, b } = sizeData;
  const C16 = calculateC16(sizeData);
  const lengthDisplacement = calculateLengthDisplacement(sizeData);
  const Vdispl = cb * t * b * lengthDisplacement;

  return (
    0.0140407 * (lwl / t) -
    1.75254 * (Math.pow(Vdispl, 1 / 3) / lwl) -
    4.79323 * (b / lwl) -
    C16
  );
};

const calculateM2 = (sizeData: IShipSize, { newFn }: IFrictionResistance) => {
  const C15 = calculateC15(sizeData);
  const { cp } = sizeData;
  return C15 * Math.pow(cp, 2) * Math.exp(-0.1 * Math.pow(newFn, -2));
};

const calculateLamda = (sizeData: IShipSize): number => {
  const { lwl, b, cp } = sizeData;
  const LdivB = lwl / b;

  return LdivB <= 12 ? 1.446 * cp - 0.03 * LdivB : 1.446 * cp - 0.36;
};

const calculateRw = (
  sizeData: IShipSize,
  frictionResistance: IFrictionResistance,
) => {
  const C1 = calculateC1(sizeData, calculateC7(sizeData));
  const C2 = calculateC2(sizeData);
  const C5 = calculateC5(sizeData);
  const { lwl, b, t, cb } = sizeData;
  const M1 = calculateM1(sizeData);
  const { newFn } = frictionResistance;
  const M2 = calculateM2(sizeData, frictionResistance);
  const lamda = calculateLamda(sizeData);

  return (
    C1 *
    C2 *
    C5 *
    (lwl * b * t * cb) *
    1025 *
    9.81 *
    Math.exp(
      M1 * Math.pow(newFn, -0.9) + M2 * Math.cos(lamda * Math.pow(newFn, -2)),
    )
  );
};

export const calculateS = (sizeData: IShipSize) => {
  const { lwl, t, b, cm, cb, cwp, bulbosbow } = sizeData;
  const bDivT = b / t;
  return (
    lwl *
      (2 * t + b) *
      Math.pow(cm, 0.5) *
      (0.453 + 0.4425 * cb - 0.2862 * cm - 0.003467 * bDivT + 0.3696 * cwp) +
    2.38 * ((bulbosbow ? 1 : 0) / cb)
  );
};

const calculateCa = (sizeData: IShipSize) => {
  const { lwl, cb } = sizeData;
  const C4 = calculateC4(sizeData);
  return (
    0.006 * Math.pow(lwl + 100, -0.16) -
    0.00205 +
    0.003 * (Math.pow(lwl / 7.5, 0.5) * Math.pow(cb, 4) * 1 * (0.04 - C4))
  );
};

const calculateRa = (
  sizeData: IShipSize,
  frictionResistance: IFrictionResistance,
) => {
  const s = calculateS(sizeData);
  const Ca = calculateCa(sizeData);
  const { speedMs } = frictionResistance.newSpeed;
  return 0.5 * 1025 * Math.pow(speedMs, 2) * s * Ca;
};

const calculateOnePlusK1 = (sizeData: IShipSize) => {
  const lengthDisplacement = calculateLengthDisplacement(sizeData);
  const VDisplacement =
    sizeData.b * sizeData.t * sizeData.cb * lengthDisplacement;
  const lr = calculateLr(sizeData);
  const C14 = 1 + 0.011 * sizeData.cstern;
  const bDivLr = sizeData.b / lr;
  const tDivL = sizeData.t / sizeData.lwl;
  const lDivLr = sizeData.lwl / lr;
  const L3DivVDisp = Math.pow(sizeData.lwl, 3) / VDisplacement;
  const oneMinCp = 1 - sizeData.cp;

  return (
    0.93 +
    0.487118 *
      C14 *
      Math.pow(bDivLr, 1.06806) *
      Math.pow(tDivL, 0.46106) *
      Math.pow(lDivLr, 0.121563) *
      Math.pow(L3DivVDisp, 0.36486) *
      Math.pow(oneMinCp, -0.604247)
  );
};

export const calculateTotalResistance = (
  sizeData: IShipSize,
  frictionResistance: IFrictionResistance,
): ITotalResistance => {
  const rw = calculateRw(sizeData, frictionResistance);
  const ra = calculateRa(sizeData, frictionResistance);
  const { Rf, Raap } = frictionResistance;

  const onePlusK1 = calculateOnePlusK1(sizeData);
  const rt = (Rf * onePlusK1 + Raap + rw + ra) / 1000;

  return {
    rt,
    rtPlusSm: rt * 1.15,
  };
};
