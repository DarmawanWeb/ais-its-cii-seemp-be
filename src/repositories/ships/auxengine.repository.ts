import {
  AuxiliaryEngine,
  IAuxiliaryEngine,
} from '../../models/ships/AuxEngine';

export class AuxiliaryEngineRepository {
  async create(data: IAuxiliaryEngine): Promise<IAuxiliaryEngine> {
    const auxiliaryEngine = new AuxiliaryEngine(data);
    return await auxiliaryEngine.save();
  }

  async getAll(): Promise<IAuxiliaryEngine[]> {
    return AuxiliaryEngine.find();
  }

  async getById(id: string): Promise<IAuxiliaryEngine | null> {
    return AuxiliaryEngine.findById(id);
  }

  async update(
    id: string,
    data: Partial<IAuxiliaryEngine>,
  ): Promise<IAuxiliaryEngine | null> {
    return AuxiliaryEngine.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IAuxiliaryEngine | null> {
    return AuxiliaryEngine.findByIdAndDelete(id);
  }
}
