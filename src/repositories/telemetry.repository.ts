import { Telemetry, ITelemetry } from '../models/Telemetry';

export class TelemetryRepository {
  async create(data: ITelemetry): Promise<ITelemetry> {
    const telemetry = new Telemetry(data);
    return await telemetry.save();
  }

  async getAll(): Promise<ITelemetry[]> {
    return Telemetry.find();
  }

  async getByMmsi(mmsi: string): Promise<ITelemetry | null> {
    return Telemetry.findOne({ mmsi });
  }

  async update(
    mmsi: string,
    data: Partial<ITelemetry>,
  ): Promise<ITelemetry | null> {
    return Telemetry.findOneAndUpdate({ mmsi }, data, { new: true });
  }

  async delete(mmsi: string): Promise<ITelemetry | null> {
    return Telemetry.findOneAndDelete({ mmsi });
  }

  async updateFuelConsumptionByMMSI(
    mmsi: string,
    fuelData: ITelemetry['fuel'][number],
  ): Promise<ITelemetry | null> {
    const telemetry = await this.getByMmsi(mmsi);
    if (!telemetry) {
      const newTelemetry = new Telemetry({ mmsi, fuel: [fuelData] });
      return await newTelemetry.save();
    }
    telemetry.fuel.push(fuelData);
    return await telemetry.save();
  }
}
