import { FuelDataRepository } from '../../repositories/ships/fuel-data.repository';
import { Request, Response } from 'express';
import { handleError } from '../../utils/error.handler';

export async function addFuelData(req: Request, res: Response) {
  try {
    const newData = await FuelDataRepository.create(req.body);
    res.status(201).json({ message: 'Fuel data added', data: newData });
  } catch (error) {
    handleError(error, res);
  }
}

export async function getAllFuelData(_req: Request, res: Response) {
  try {
    const allData = await FuelDataRepository.findAll();
    res.status(200).json({ data: allData });
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteFuelData(req: Request, res: Response) {
  const { mmsi } = req.params;
  try {
    const deletedData = await FuelDataRepository.deleteByMMSI(mmsi);
    if (!deletedData) {
      res.status(404).json({ message: 'Fuel data not found' });
    }
    res.status(200).json({ message: 'Fuel data deleted', data: deletedData });
  } catch (error) {
    handleError(error, res);
  }
}
