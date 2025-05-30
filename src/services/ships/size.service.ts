import { ShipSizeRepository } from '../../repositories/ships/size.repository';
import { IShipSize } from '../../models/ships/Size';

export class ShipSizeService {
  private shipSizeRepository: ShipSizeRepository;

  constructor() {
    this.shipSizeRepository = new ShipSizeRepository();
  }

  async createShipSize(data: IShipSize): Promise<IShipSize> {
    return await this.shipSizeRepository.create(data);
  }

  async getAllShipSizes(): Promise<IShipSize[]> {
    return await this.shipSizeRepository.getAll();
  }

  async getShipSizeById(id: string): Promise<IShipSize | null> {
    return await this.shipSizeRepository.getById(id);
  }

  async updateShipSize(
    id: string,
    data: Partial<IShipSize>,
  ): Promise<IShipSize | null> {
    return await this.shipSizeRepository.update(id, data);
  }

  async deleteShipSize(id: string): Promise<IShipSize | null> {
    return await this.shipSizeRepository.delete(id);
  }
}
