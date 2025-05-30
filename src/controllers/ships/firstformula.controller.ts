import { Request, Response } from 'express';
import { FirstFuelFormulaService } from '../../services/ships/firstformula.sevice';
import { handleError } from '../../utils/error.handler';

const firstFuelFormulaService = new FirstFuelFormulaService();

export const createFirstFuelFormulaController = async (
  req: Request,
  res: Response,
) => {
  try {
    const firstFuelFormula =
      await firstFuelFormulaService.createFirstFuelFormula(req.body);
    res.status(201).json({
      message: 'FirstFuelFormula created successfully',
      data: firstFuelFormula,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllFirstFuelFormulasController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const firstFuelFormulas =
      await firstFuelFormulaService.getAllFirstFuelFormulas();
    res.status(200).json({
      message: 'All FirstFuelFormulas fetched successfully',
      data: firstFuelFormulas,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getFirstFuelFormulaByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const firstFuelFormula =
      await firstFuelFormulaService.getFirstFuelFormulaById(id);
    res.status(200).json({
      message: 'FirstFuelFormula fetched successfully',
      data: firstFuelFormula,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateFirstFuelFormulaController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const updatedFirstFuelFormula =
      await firstFuelFormulaService.updateFirstFuelFormula(id, req.body);
    res.status(200).json({
      message: 'FirstFuelFormula updated successfully',
      data: updatedFirstFuelFormula,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteFirstFuelFormulaController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  try {
    const deletedFirstFuelFormula =
      await firstFuelFormulaService.deleteFirstFuelFormula(id);
    if (!deletedFirstFuelFormula) {
      res.status(404).json({
        message: 'FirstFuelFormula not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'FirstFuelFormula deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
