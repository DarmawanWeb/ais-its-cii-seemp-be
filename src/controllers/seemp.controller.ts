import type { Request, Response } from 'express';
import { SEEMPService } from '../services/seemp.service';
import { handleError } from '../utils/error.handler';

const seempService = new SEEMPService();

export const getSEEMPByMmsiController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { mmsi } = req.params;
    const seempData = await seempService.calculateSEEMPbyMMSI(mmsi);
    if (!seempData) {
      res.status(404).json({
        message: 'SEEMP data not found',
        success: false,
      });
      return;
    }
    res.status(200).json({
      message: 'SEEMP data fetched successfully',
      data: seempData,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
