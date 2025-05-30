import { FuelRepository } from '../../repositories/ships/fuel.repository';
import { IFuel } from '../../models/ships/Fuel';

export class FuelService {
  private fuelRepository: FuelRepository;

  constructor() {
    this.fuelRepository = new FuelRepository();
  }

  async createFuel(data: IFuel): Promise<IFuel> {
    return await this.fuelRepository.create(data);
  }

  async getAllFuels(): Promise<IFuel[]> {
    return await this.fuelRepository.getAll();
  }

  async getFuelById(id: string): Promise<IFuel | null> {
    return await this.fuelRepository.getById(id);
  }

  async updateFuel(id: string, data: Partial<IFuel>): Promise<IFuel | null> {
    return await this.fuelRepository.update(id, data);
  }

  async deleteFuel(id: string): Promise<IFuel | null> {
    return await this.fuelRepository.delete(id);
  }
}
