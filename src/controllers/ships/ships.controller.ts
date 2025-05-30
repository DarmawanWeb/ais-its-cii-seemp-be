import { Request, Response } from 'express';
import { ShipService } from '../../services/ships/ship.service';
import { handleError } from '../../utils/error.handler';

const shipService = new ShipService();

export const createShipController = async (req: Request, res: Response) => {
  try {
    const ship = await shipService.createShip(req.body);
    res.status(201).json({
      message: 'Ship created successfully',
      data: ship,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllShipsController = async (_req: Request, res: Response) => {
  try {
    const ships = await shipService.getAllShips();
    res.status(200).json({
      message: 'All ships fetched successfully',
      data: ships,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getShipByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ship = await shipService.getShipById(id);
    res.status(200).json({
      message: 'Ship fetched successfully',
      data: ship,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateShipController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedShip = await shipService.updateShip(id, req.body);
    res.status(200).json({
      message: 'Ship updated successfully',
      data: updatedShip,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteShipController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedShip = await shipService.deleteShip(id);
    if (!deletedShip) {
      res.status(404).json({
        message: 'Ship not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Ship deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
