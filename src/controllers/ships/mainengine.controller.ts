import { Request, Response } from 'express';
import { MainEngineService } from '../../services/ships/mainengine.service';
import { handleError } from '../../utils/error.handler';

const mainEngineService = new MainEngineService();

export const createMainEngineController = async (
  req: Request,
  res: Response,
) => {
  try {
    const mainEngine = await mainEngineService.createMainEngine(req.body);
    res.status(201).json({
      message: 'MainEngine created successfully',
      data: mainEngine,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllMainEnginesController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const mainEngines = await mainEngineService.getAllMainEngines();
    res.status(200).json({
      message: 'All MainEngines fetched successfully',
      data: mainEngines,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getMainEngineByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const mainEngine = await mainEngineService.getMainEngineById(id);
    res.status(200).json({
      message: 'MainEngine fetched successfully',
      data: mainEngine,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateMainEngineController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const updatedMainEngine = await mainEngineService.updateMainEngine(
      id,
      req.body,
    );
    res.status(200).json({
      message: 'MainEngine updated successfully',
      data: updatedMainEngine,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteMainEngineController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const deletedMainEngine = await mainEngineService.deleteMainEngine(id);
    if (!deletedMainEngine) {
      res.status(404).json({
        message: 'MainEngine not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'MainEngine deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
