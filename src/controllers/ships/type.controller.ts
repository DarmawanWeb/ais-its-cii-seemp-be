import { type Request, type Response } from 'express';
import { ShipTypeService } from '../../services/ships/type.service';
import { handleError } from '../../utils/error.handler';

const shipTypeService = new ShipTypeService();

export const createShipTypeController = async (req: Request, res: Response) => {
  try {
    const shipType = await shipTypeService.createShipType(req.body);
    res.status(201).json({
      message: 'ShipType created successfully',
      data: shipType,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllShipTypesController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const shipTypes = await shipTypeService.getAllShipTypes();
    res.status(200).json({
      message: 'All ShipTypes fetched successfully',
      data: shipTypes,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getShipTypeByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const shipType = await shipTypeService.getShipTypeById(id);
    res.status(200).json({
      message: 'ShipType fetched successfully',
      data: shipType,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateShipTypeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedShipType = await shipTypeService.updateShipType(id, req.body);
    res.status(200).json({
      message: 'ShipType updated successfully',
      data: updatedShipType,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteShipTypeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedShipType = await shipTypeService.deleteShipType(id);
    if (!deletedShipType) {
      res.status(404).json({
        message: 'ShipType not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'ShipType deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
