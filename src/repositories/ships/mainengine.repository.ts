import { MainEngine, IMainEngine } from '../../models/ships/MainEngine';

export class MainEngineRepository {
  async create(data: IMainEngine): Promise<IMainEngine> {
    const mainEngine = new MainEngine(data);
    return await mainEngine.save();
  }

  async getAll(): Promise<IMainEngine[]> {
    return MainEngine.find();
  }

  async getById(id: string): Promise<IMainEngine | null> {
    return MainEngine.findById(id);
  }

  async update(
    id: string,
    data: Partial<IMainEngine>,
  ): Promise<IMainEngine | null> {
    return MainEngine.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IMainEngine | null> {
    return MainEngine.findByIdAndDelete(id);
  }
}
