import { Fuel, IFuel } from '../../models/ships/Fuel';

export class FuelRepository {
  async create(data: IFuel): Promise<IFuel> {
    const fuel = new Fuel(data);
    return await fuel.save();
  }

  async getAll(): Promise<IFuel[]> {
    return Fuel.find();
  }

  async getById(id: string): Promise<IFuel | null> {
    return Fuel.findById(id);
  }

  async update(id: string, data: Partial<IFuel>): Promise<IFuel | null> {
    return Fuel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IFuel | null> {
    return Fuel.findByIdAndDelete(id);
  }
}
