import { Request, Response } from 'express';
import { ShipSizeService } from '../../services/ships/size.service';
import { handleError } from '../../utils/error.handler';

const shipSizeService = new ShipSizeService();

// Create ShipSize
export const createShipSizeController = async (req: Request, res: Response) => {
  try {
    const shipSize = await shipSizeService.createShipSize(req.body);
    res.status(201).json({
      message: 'ShipSize created successfully',
      data: shipSize,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

// Get all ShipSizes
export const getAllShipSizesController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const shipSizes = await shipSizeService.getAllShipSizes();
    res.status(200).json({
      message: 'All ShipSizes fetched successfully',
      data: shipSizes,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

// Get ShipSize by ID
export const getShipSizeByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const shipSize = await shipSizeService.getShipSizeById(id);
    res.status(200).json({
      message: 'ShipSize fetched successfully',
      data: shipSize,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

// Update ShipSize
export const updateShipSizeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedShipSize = await shipSizeService.updateShipSize(id, req.body);
    res.status(200).json({
      message: 'ShipSize updated successfully',
      data: updatedShipSize,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

// Delete ShipSize
export const deleteShipSizeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedShipSize = await shipSizeService.deleteShipSize(id);
    if (!deletedShipSize) {
      res.status(404).json({
        message: 'ShipSize not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'ShipSize deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
