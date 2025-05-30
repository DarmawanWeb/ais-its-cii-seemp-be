import { type Request, type Response } from 'express';
import { FuelService } from '../../services/ships/fuel.service';
import { handleError } from '../../utils/error.handler';

const fuelService = new FuelService();

export const createFuelController = async (req: Request, res: Response) => {
  try {
    const fuel = await fuelService.createFuel(req.body);
    res.status(201).json({
      message: 'Fuel created successfully',
      data: fuel,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllFuelsController = async (_req: Request, res: Response) => {
  try {
    const fuels = await fuelService.getAllFuels();
    res.status(200).json({
      message: 'All Fuels fetched successfully',
      data: fuels,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getFuelByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const fuel = await fuelService.getFuelById(id);
    res.status(200).json({
      message: 'Fuel fetched successfully',
      data: fuel,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateFuelController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedFuel = await fuelService.updateFuel(id, req.body);
    res.status(200).json({
      message: 'Fuel updated successfully',
      data: updatedFuel,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteFuelController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedFuel = await fuelService.deleteFuel(id);
    if (!deletedFuel) {
      res.status(404).json({
        message: 'Fuel not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Fuel deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
