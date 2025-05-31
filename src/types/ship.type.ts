import { IShipGeneral } from '../models/ships/General';
import { IShipSize } from '../models/ships/Size';
import { IShipType } from '../models/ships/Type';
import { IFuel } from '../models/ships/Fuel';
import { IMainEngine } from '../models/ships/MainEngine';
import { IAuxiliaryEngine } from '../models/ships/AuxEngine';
import { IFirstFuelFormula } from '../models/ships/FirstFuelFormula';

export interface IShipData {
  mmsi: string;
  generalData: IShipGeneral;
  sizeData: IShipSize;
  typeData: IShipType;
  fuelType: IFuel;
  engineSpecs: {
    mainEngine: {
      engine: IMainEngine;
      quantity: number;
    };
    auxiliaryEngine: {
      engine: IAuxiliaryEngine[];
      quantity: number;
    };
  };
  fuelFormulas: {
    firstFuelFormula: IFirstFuelFormula;
  };
}
