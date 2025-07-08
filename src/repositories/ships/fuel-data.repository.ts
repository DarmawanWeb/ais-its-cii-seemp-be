import FuelData from "../../models/ships/Telemetry";
import { IFuelData } from "../../models/ships/Telemetry";

export const FuelDataRepository = {
  async create(fuelData : IFuelData ) {
    return await FuelData.create(fuelData);
  },

  async findAll() {
    return await FuelData.find({});
  },
};
