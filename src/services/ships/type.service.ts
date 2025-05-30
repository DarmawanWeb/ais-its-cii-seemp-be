import { ShipTypeRepository } from '../../repositories/ships/type.repository';
import { IShipType } from '../../models/ships/Type';

export class ShipTypeService {
  private shipTypeRepository: ShipTypeRepository;

  constructor() {
    this.shipTypeRepository = new ShipTypeRepository();
  }

  async createShipType(data: IShipType): Promise<IShipType> {
    return await this.shipTypeRepository.create(data);
  }

  async getAllShipTypes(): Promise<IShipType[]> {
    return await this.shipTypeRepository.getAll();
  }

  async getShipTypeById(id: string): Promise<IShipType | null> {
    return await this.shipTypeRepository.getById(id);
  }

  async updateShipType(
    id: string,
    data: Partial<IShipType>,
  ): Promise<IShipType | null> {
    return await this.shipTypeRepository.update(id, data);
  }

  async deleteShipType(id: string): Promise<IShipType | null> {
    return await this.shipTypeRepository.delete(id);
  }
}
