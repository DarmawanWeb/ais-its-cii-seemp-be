import { PortRepository } from '../repositories/port.repository';
import { IPort } from '../models/Port';

export class PortService {
  private portRepository: PortRepository;

  constructor() {
    this.portRepository = new PortRepository();
  }

  async createPort(data: IPort): Promise<IPort> {
    return await this.portRepository.create(data);
  }

  async getAllPorts(): Promise<IPort[]> {
    return await this.portRepository.getAll();
  }

  async getPortById(id: string): Promise<IPort | null> {
    return await this.portRepository.getById(id);
  }

  async updatePort(id: string, data: Partial<IPort>): Promise<IPort | null> {
    return await this.portRepository.update(id, data);
  }

  async deletePort(id: string): Promise<IPort | null> {
    return await this.portRepository.delete(id);
  }
}
