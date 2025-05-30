import { MainEngineRepository } from '../../repositories/ships/mainengine.repository';
import { IMainEngine } from '../../models/ships/MainEngine';

export class MainEngineService {
  private mainEngineRepository: MainEngineRepository;

  constructor() {
    this.mainEngineRepository = new MainEngineRepository();
  }

  async createMainEngine(data: IMainEngine): Promise<IMainEngine> {
    return await this.mainEngineRepository.create(data);
  }

  async getAllMainEngines(): Promise<IMainEngine[]> {
    return await this.mainEngineRepository.getAll();
  }

  async getMainEngineById(id: string): Promise<IMainEngine | null> {
    return await this.mainEngineRepository.getById(id);
  }

  async updateMainEngine(
    id: string,
    data: Partial<IMainEngine>,
  ): Promise<IMainEngine | null> {
    return await this.mainEngineRepository.update(id, data);
  }

  async deleteMainEngine(id: string): Promise<IMainEngine | null> {
    return await this.mainEngineRepository.delete(id);
  }
}
