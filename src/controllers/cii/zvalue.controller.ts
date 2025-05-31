import { Request, Response } from 'express';
import { ZValueService } from '../../services/cii/zvalue.service';
import { handleError } from '../../utils/error.handler';

const zValueService = new ZValueService();

export const createZValueController = async (req: Request, res: Response) => {
  try {
    const zValue = await zValueService.createZValue(req.body);
    res.status(201).json({
      message: 'ZValue created successfully',
      data: zValue,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllZValuesController = async (_req: Request, res: Response) => {
  try {
    const zValues = await zValueService.getAllZValues();
    res.status(200).json({
      message: 'All ZValues fetched successfully',
      data: zValues,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getZValueByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const zValue = await zValueService.getZValueById(id);
    res.status(200).json({
      message: 'ZValue fetched successfully',
      data: zValue,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getZValueByYearController = async (
  req: Request,
  res: Response,
) => {
  const { year } = req.params;
  try {
    const zValue = await zValueService.getZValueByYear(Number(year));
    if (!zValue) {
      res.status(404).json({
        message: 'ZValue not found for the specified year',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'ZValue fetched successfully',
        data: zValue,
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateZValueController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedZValue = await zValueService.updateZValue(id, req.body);
    res.status(200).json({
      message: 'ZValue updated successfully',
      data: updatedZValue,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteZValueController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedZValue = await zValueService.deleteZValue(id);
    if (!deletedZValue) {
      res.status(404).json({
        message: 'ZValue not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'ZValue deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
