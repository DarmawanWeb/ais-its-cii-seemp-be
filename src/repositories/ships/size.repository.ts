import { ShipSize, IShipSize } from '../../models/ships/Size';

export class ShipSizeRepository {
  async create(data: IShipSize): Promise<IShipSize> {
    const shipSize = new ShipSize(data);
    return await shipSize.save();
  }

  async getAll(): Promise<IShipSize[]> {
    return ShipSize.find();
  }

  async getById(id: string): Promise<IShipSize | null> {
    return ShipSize.findById(id);
  }

  async update(
    id: string,
    data: Partial<IShipSize>,
  ): Promise<IShipSize | null> {
    return ShipSize.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IShipSize | null> {
    return ShipSize.findByIdAndDelete(id);
  }
}
