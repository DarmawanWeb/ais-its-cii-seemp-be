import { Port, type IPort } from '../models/Port';

export class PortRepository {
  async create(data: IPort): Promise<IPort> {
    const port = new Port(data);
    return await port.save();
  }

  async getAll(): Promise<IPort[]> {
    return Port.find();
  }

  async getById(id: string): Promise<IPort | null> {
    return Port.findById(id);
  }

  async update(id: string, data: Partial<IPort>): Promise<IPort | null> {
    return Port.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IPort | null> {
    return Port.findByIdAndDelete(id);
  }
}
