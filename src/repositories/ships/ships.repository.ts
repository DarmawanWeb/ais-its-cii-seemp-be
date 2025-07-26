import { Ship, IShip } from '../../models/ships/Ship';
import { SecondaryShip } from '../../models/SecondaryShip';
import { IShipData } from '../../types/ship.type';
import { IShipType } from '../../models/ships/Type';
import { ISecondaryShip } from '../../models/SecondaryShip';
import { ShipGeneral } from '../../models/ships/General';
import { ShipType } from '../../models/ships/Type';
import { ShipSize } from '../../models/ships/Size';

export class ShipRepository {
  async create(data: IShip): Promise<IShip> {
    const ship = new Ship(data);
    const generalData = await ShipGeneral.findById(data.generalData);
    const typeData = await ShipType.findById(data.typeData);
    const sizeData = await ShipSize.findById(data.sizeData);
    await new SecondaryShip({
      MMSI: data.mmsi,
      IMO: generalData?.imoNumber,
      NAME: generalData?.name,
      BUILT: generalData?.built,
      FLAG: generalData?.flag,  
      FLAGNAME: generalData?.flag,
      TYPE: typeData?.name,
      TYPENAME: typeData?.name,
      GT: sizeData?.capacity,
      DWT: sizeData?.dwt,
      LOA: sizeData?.loa,
      BEAM: sizeData?.b,
      DRAUGHT: sizeData?.t,
      CLASS: "CLASS",
      CLASSCODE: "CLASSCODE",
    }).save();
    return await ship.save();
  }

  async getAll(): Promise<IShip[]> {
    return Ship.find()
      .populate('generalData')
      .populate('sizeData')
      .populate('typeData')
      .populate('fuelType')
      .populate('engineSpecs.mainEngine.engine')
      .populate('engineSpecs.auxiliaryEngine.engine')
      .populate('fuelFormulas.firstFuelFormula')
      .populate('shipPort');
  }

  async getById(id: string): Promise<IShip | null> {
    return Ship.findById(id)
      .populate('generalData')
      .populate('sizeData')
      .populate('typeData')
      .populate('fuelType')
      .populate('engineSpecs.mainEngine.engine')
      .populate('engineSpecs.auxiliaryEngine.engine')
      .populate('fuelFormulas.firstFuelFormula')
      .populate('shipPort');
  }

  async getByMMSI(mmsi: string): Promise<IShipData | null> {
    return Ship.findOne({ mmsi })
      .populate('generalData')
      .populate('sizeData')
      .populate('typeData')
      .populate('fuelType')
      .populate('engineSpecs.mainEngine.engine')
      .populate('engineSpecs.auxiliaryEngine.engine')
      .populate('fuelFormulas.firstFuelFormula')
      .populate('shipPort')
      .lean<IShipData>();
  }
  async update(id: string, data: Partial<IShip>): Promise<IShip | null> {
    return Ship.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IShip | null> {
    return Ship.findByIdAndDelete(id);
  }

  async getShipTypeByMmsi(mmsi: string): Promise<IShipType | null> {
    const ship = await Ship.findOne({ mmsi })
      .populate('typeData')
      .lean<{ typeData: IShipType }>();
    return ship ? ship.typeData : null;
  }

  async getSecondaryShipByMMSI(mmsi: string): Promise<ISecondaryShip | null> {
    return await SecondaryShip.findOne({ MMSI: mmsi });
  }
}
