import { Ship, IShip } from '../../models/ships/Ship';
import { IShipData } from '../../types/ship.type';

export class ShipRepository {
  async create(data: IShip): Promise<IShip> {
    const ship = new Ship(data);
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
}
