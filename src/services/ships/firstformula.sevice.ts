import { FirstFuelFormulaRepository } from '../../repositories/ships/firstformula.repository';
import { IFirstFuelFormula } from '../../models/ships/FirstFuelFormula';

export class FirstFuelFormulaService {
  private firstFuelFormulaRepository: FirstFuelFormulaRepository;

  constructor() {
    this.firstFuelFormulaRepository = new FirstFuelFormulaRepository();
  }

  async createFirstFuelFormula(
    data: IFirstFuelFormula,
  ): Promise<IFirstFuelFormula> {
    return await this.firstFuelFormulaRepository.create(data);
  }

  async getAllFirstFuelFormulas(): Promise<IFirstFuelFormula[]> {
    console.log('Fetching all first fuel formulas');
    return await this.firstFuelFormulaRepository.getAll();
  }

  async getFirstFuelFormulaById(id: string): Promise<IFirstFuelFormula | null> {
    return await this.firstFuelFormulaRepository.getById(id);
  }

  async updateFirstFuelFormula(
    id: string,
    data: Partial<IFirstFuelFormula>,
  ): Promise<IFirstFuelFormula | null> {
    return await this.firstFuelFormulaRepository.update(id, data);
  }

  async deleteFirstFuelFormula(id: string): Promise<IFirstFuelFormula | null> {
    return await this.firstFuelFormulaRepository.delete(id);
  }
}
