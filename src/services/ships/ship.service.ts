import { ShipRepository } from '../../repositories/ships/ships.repository';
import { IShip } from '../../models/ships/Ship';

export class ShipService {
  private shipRepository: ShipRepository;

  constructor() {
    this.shipRepository = new ShipRepository();
  }

  async createShip(data: IShip): Promise<IShip> {
    return await this.shipRepository.create(data);
  }

  async getAllShips(): Promise<IShip[]> {
    return await this.shipRepository.getAll();
  }

  async getShipById(id: string): Promise<IShip | null> {
    return await this.shipRepository.getById(id);
  }

  async getShipByMMSI(mmsi: string): Promise<IShip | null> {
    return await this.shipRepository.getByMMSI(mmsi);
  }

  async updateShip(id: string, data: Partial<IShip>): Promise<IShip | null> {
    return await this.shipRepository.update(id, data);
  }

  async deleteShip(id: string): Promise<IShip | null> {
    return await this.shipRepository.delete(id);
  }
}
