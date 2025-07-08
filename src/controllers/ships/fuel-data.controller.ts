import { FuelDataRepository } from "../../repositories/ships/fuel-data.repository";
import { Request, Response } from 'express';
import { handleError } from '../../utils/error.handler';

export const FuelDataController = {
  async addFuelData(req : Request, res : Response) {
    try {
      const newData = await FuelDataRepository.create(req.body);
      res.status(201).json({ message: "Fuel data added", data: newData });
    } catch (error) {
        handleError(error, res);
    }
  },

  async getAllFuelData(_req : Request, res : Response) {
    try {
      const allData = await FuelDataRepository.findAll();
      res.status(200).json({ data: allData });
    } catch (error) {
      handleError(error, res);
    }
  },
};
