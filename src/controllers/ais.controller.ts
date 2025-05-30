import type { Request, Response } from 'express';
import { AisService } from '../services/ais.service';
import { handleError } from '../utils/error.handler';

const aisService = new AisService();
export const getAllAisController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const aisData = await aisService.getAllAis();
    res.status(200).json({
      message: 'Ais data fetched successfully',
      data: aisData,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAisByMmsiController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { mmsi } = req.params;
    const aisData = await aisService.getAisByMmsi(mmsi);
    if (!aisData) {
      res.status(404).json({
        message: 'Ais data not found',
        success: false,
      });
      return;
    }
    res.status(200).json({
      message: 'Ais data fetched successfully',
      data: aisData,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
