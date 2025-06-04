import { TelemetryRepository } from '../repositories/telemetry.repository';
import { ITelemetry } from '../models/Telemetry';

export class TelemetryService {
  private telemetryRepository: TelemetryRepository;

  constructor() {
    this.telemetryRepository = new TelemetryRepository();
  }

  async createTelemetry(data: ITelemetry): Promise<ITelemetry> {
    return await this.telemetryRepository.create(data);
  }

  async getAllTelemetry(): Promise<ITelemetry[]> {
    return await this.telemetryRepository.getAll();
  }

  async getTelemetryByMmsi(mmsi: string): Promise<ITelemetry | null> {
    return await this.telemetryRepository.getByMmsi(mmsi);
  }

  async updateTelemetry(
    mmsi: string,
    data: Partial<ITelemetry>,
  ): Promise<ITelemetry | null> {
    return await this.telemetryRepository.update(mmsi, data);
  }

  async deleteTelemetry(mmsi: string): Promise<ITelemetry | null> {
    return await this.telemetryRepository.delete(mmsi);
  }

  async updateFuelConsumptionByMMSI(
    mmsi: string,
    fuelData: ITelemetry['fuel'][number],
  ): Promise<ITelemetry | null> {
    return await this.telemetryRepository.updateFuelConsumptionByMMSI(
      mmsi,
      fuelData,
    );
  }
}
