import { IZValue, ZValue } from '../../models/cii/ZValue';

export class ZValueRepository {
  async create(data: IZValue): Promise<IZValue> {
    const zValue = new ZValue(data);
    return await zValue.save();
  }

  async getAll(): Promise<IZValue[]> {
    return ZValue.find();
  }

  async getById(id: string): Promise<IZValue | null> {
    return ZValue.findById(id);
  }

  async getValueByYear(year: number): Promise<IZValue | null> {
    return ZValue.findOne({ year });
  }

  async update(id: string, data: Partial<IZValue>): Promise<IZValue | null> {
    return ZValue.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IZValue | null> {
    return ZValue.findByIdAndDelete(id);
  }

  async getHighestYear(): Promise<number> {
    const highestYearZValue = await ZValue.findOne()
      .sort({ year: -1 })
      .limit(1);
    return highestYearZValue?.year || 2030;
  }
}
