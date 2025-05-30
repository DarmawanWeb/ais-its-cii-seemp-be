import { Request, Response } from 'express';
import { AuxiliaryEngineService } from '../../services/ships/auxengine.service';
import { handleError } from '../../utils/error.handler';

const auxiliaryEngineService = new AuxiliaryEngineService();

export const createAuxiliaryEngineController = async (
  req: Request,
  res: Response,
) => {
  try {
    const auxiliaryEngine = await auxiliaryEngineService.createAuxiliaryEngine(
      req.body,
    );
    res.status(201).json({
      message: 'AuxiliaryEngine created successfully',
      data: auxiliaryEngine,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllAuxiliaryEnginesController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const auxiliaryEngines =
      await auxiliaryEngineService.getAllAuxiliaryEngines();
    res.status(200).json({
      message: 'All AuxiliaryEngines fetched successfully',
      data: auxiliaryEngines,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAuxiliaryEngineByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const auxiliaryEngine =
      await auxiliaryEngineService.getAuxiliaryEngineById(id);
    res.status(200).json({
      message: 'AuxiliaryEngine fetched successfully',
      data: auxiliaryEngine,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateAuxiliaryEngineController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const updatedAuxiliaryEngine =
      await auxiliaryEngineService.updateAuxiliaryEngine(id, req.body);
    res.status(200).json({
      message: 'AuxiliaryEngine updated successfully',
      data: updatedAuxiliaryEngine,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteAuxiliaryEngineController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const deletedAuxiliaryEngine =
      await auxiliaryEngineService.deleteAuxiliaryEngine(id);
    if (!deletedAuxiliaryEngine) {
      res.status(404).json({
        message: 'AuxiliaryEngine not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'AuxiliaryEngine deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
