import { ShipGeneralRepository } from '../../repositories/ships/general.repository';
import { IShipGeneral } from '../../models/ships/General';

export class ShipGeneralService {
  private shipGeneralRepository: ShipGeneralRepository;
  constructor() {
    this.shipGeneralRepository = new ShipGeneralRepository();
  }
  async createShipGeneral(data: IShipGeneral): Promise<IShipGeneral> {
    return await this.shipGeneralRepository.create(data);
  }

  async getAllShipGenerals(): Promise<IShipGeneral[]> {
    return await this.shipGeneralRepository.getAll();
  }

  async getShipGeneralById(id: string): Promise<IShipGeneral | null> {
    return await this.shipGeneralRepository.getById(id);
  }

  async updateShipGeneral(
    id: string,
    data: Partial<IShipGeneral>,
  ): Promise<IShipGeneral | null> {
    return await this.shipGeneralRepository.update(id, data);
  }

  async deleteShipGeneral(id: string): Promise<IShipGeneral | null> {
    return await this.shipGeneralRepository.delete(id);
  }
}
