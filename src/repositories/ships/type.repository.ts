import { ShipType, IShipType } from '../../models/ships/Type';

export class ShipTypeRepository {
  async create(data: IShipType): Promise<IShipType> {
    const shipType = new ShipType(data);
    return await shipType.save();
  }

  async getAll(): Promise<IShipType[]> {
    return ShipType.find();
  }

  async getById(id: string): Promise<IShipType | null> {
    return ShipType.findById(id);
  }

  async update(
    id: string,
    data: Partial<IShipType>,
  ): Promise<IShipType | null> {
    return ShipType.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IShipType | null> {
    return ShipType.findByIdAndDelete(id);
  }
}
