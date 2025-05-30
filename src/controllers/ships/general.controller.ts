import { Request, Response } from 'express';
import { ShipGeneralService } from '../../services/ships/general.service';
import { handleError } from '../../utils/error.handler';

const shipGeneralService = new ShipGeneralService();

export const createShipGeneralController = async (
  req: Request,
  res: Response,
) => {
  try {
    const shipGeneral = await shipGeneralService.createShipGeneral(req.body);
    res.status(201).json({
      message: 'ShipGeneral created successfully',
      data: shipGeneral,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllShipGeneralsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const shipGenerals = await shipGeneralService.getAllShipGenerals();
    res.status(200).json({
      message: 'All ShipGenerals fetched successfully',
      data: shipGenerals,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getShipGeneralByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const shipGeneral = await shipGeneralService.getShipGeneralById(id);
    res.status(200).json({
      message: 'ShipGeneral fetched successfully',
      data: shipGeneral,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateShipGeneralController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const updatedShipGeneral = await shipGeneralService.updateShipGeneral(
      id,
      req.body,
    );
    res.status(200).json({
      message: 'ShipGeneral updated successfully',
      data: updatedShipGeneral,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteShipGeneralController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const deletedShipGeneral = await shipGeneralService.deleteShipGeneral(id);
    if (!deletedShipGeneral) {
      res.status(404).json({
        message: 'ShipGeneral not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'ShipGeneral deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
