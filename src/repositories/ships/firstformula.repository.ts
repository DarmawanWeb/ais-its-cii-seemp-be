import {
  FirstFuelFormula,
  IFirstFuelFormula,
} from '../../models/ships/FirstFuelFormula';

export class FirstFuelFormulaRepository {
  async create(data: IFirstFuelFormula): Promise<IFirstFuelFormula> {
    const firstFuelFormula = new FirstFuelFormula(data);
    return await firstFuelFormula.save();
  }

  async getAll(): Promise<IFirstFuelFormula[]> {
    return FirstFuelFormula.find();
  }

  async getById(id: string): Promise<IFirstFuelFormula | null> {
    return FirstFuelFormula.findById(id);
  }

  async update(
    id: string,
    data: Partial<IFirstFuelFormula>,
  ): Promise<IFirstFuelFormula | null> {
    return FirstFuelFormula.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IFirstFuelFormula | null> {
    return FirstFuelFormula.findByIdAndDelete(id);
  }
}
