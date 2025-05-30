import { ShipGeneral, IShipGeneral } from '../../models/ships/General';

export class ShipGeneralRepository {
  async create(data: IShipGeneral): Promise<IShipGeneral> {
    const shipGeneral = new ShipGeneral(data);
    return await shipGeneral.save();
  }

  async getAll(): Promise<IShipGeneral[]> {
    return ShipGeneral.find();
  }

  async getById(id: string): Promise<IShipGeneral | null> {
    return ShipGeneral.findById(id);
  }

  async update(
    id: string,
    data: Partial<IShipGeneral>,
  ): Promise<IShipGeneral | null> {
    return ShipGeneral.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IShipGeneral | null> {
    return ShipGeneral.findByIdAndDelete(id);
  }
}
