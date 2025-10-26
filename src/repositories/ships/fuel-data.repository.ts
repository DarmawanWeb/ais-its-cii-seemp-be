import FuelData from '../../models/ships/Telemetry';
import { IFuelData } from '../../models/ships/Telemetry';

export const FuelDataRepository = {
  async create(fuelData: IFuelData) {
    return await FuelData.create(fuelData);
  },

  async findAll() {
    return await FuelData.find({});
  },

  async isActive(mmsi: string) {
    try {
      const lastEntry = await FuelData.findOne({ mmsi }).sort({
        createdAt: -1,
      });
      if (!lastEntry) return false;

      const now = new Date();
      const lastTimestamp = lastEntry.createdAt
        ? new Date(lastEntry.createdAt)
        : new Date(0);
      const differenceInMinutes =
        (now.getTime() - lastTimestamp.getTime()) / 10000;
      return differenceInMinutes <= 1;
    } catch (error) {
      console.error(`Error checking activity for MMSI ${mmsi}:`, error);
      return false;
    }
  },

  async getLatestByMMSI(mmsi: string) {
    try {
      return await FuelData.findOne({ mmsi }).sort({ createdAt: -1 });
    } catch (error) {
      console.error(`Error fetching latest fuel data for MMSI ${mmsi}:`, error);
      throw error;
    }
  },

  async deleteByMMSI(mmsi: string) {
    try {
      const result = await FuelData.deleteMany({ mmsi });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting fuel data for MMSI ${mmsi}:`, error);
      throw error;
    }
  },
};
