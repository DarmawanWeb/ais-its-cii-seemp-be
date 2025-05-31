import { ZValueRepository } from '../../repositories/cii/zvalue.repository';
import { IZValue } from '../../models/cii/ZValue';

export class ZValueService {
  private zValueRepository: ZValueRepository;

  constructor() {
    this.zValueRepository = new ZValueRepository();
  }

  async createZValue(data: IZValue): Promise<IZValue> {
    return await this.zValueRepository.create(data);
  }

  async getAllZValues(): Promise<IZValue[]> {
    return await this.zValueRepository.getAll();
  }

  async getZValueById(id: string): Promise<IZValue | null> {
    return await this.zValueRepository.getById(id);
  }

  async getZValueByYear(year: number): Promise<IZValue | null> {
    return await this.zValueRepository.getValueByYear(year);
  }

  async updateZValue(
    id: string,
    data: Partial<IZValue>,
  ): Promise<IZValue | null> {
    return await this.zValueRepository.update(id, data);
  }

  async deleteZValue(id: string): Promise<IZValue | null> {
    return await this.zValueRepository.delete(id);
  }
}
