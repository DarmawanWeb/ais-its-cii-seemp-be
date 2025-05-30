import { AuxiliaryEngineRepository } from '../../repositories/ships/auxengine.repository';
import { IAuxiliaryEngine } from '../../models/ships/AuxEngine';

export class AuxiliaryEngineService {
  private auxiliaryEngineRepository: AuxiliaryEngineRepository;

  constructor() {
    this.auxiliaryEngineRepository = new AuxiliaryEngineRepository();
  }

  async createAuxiliaryEngine(
    data: IAuxiliaryEngine,
  ): Promise<IAuxiliaryEngine> {
    return await this.auxiliaryEngineRepository.create(data);
  }

  async getAllAuxiliaryEngines(): Promise<IAuxiliaryEngine[]> {
    return await this.auxiliaryEngineRepository.getAll();
  }

  async getAuxiliaryEngineById(id: string): Promise<IAuxiliaryEngine | null> {
    return await this.auxiliaryEngineRepository.getById(id);
  }

  async updateAuxiliaryEngine(
    id: string,
    data: Partial<IAuxiliaryEngine>,
  ): Promise<IAuxiliaryEngine | null> {
    return await this.auxiliaryEngineRepository.update(id, data);
  }

  async deleteAuxiliaryEngine(id: string): Promise<IAuxiliaryEngine | null> {
    return await this.auxiliaryEngineRepository.delete(id);
  }
}
