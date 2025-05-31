import type { Request, Response } from 'express';
import { handleError } from '../../utils/error.handler';
import { CIIService } from '../../services/cii/cii.service';

const ciiService = new CIIService();

export const getCIIByMmsiController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { mmsi } = req.params;
    await ciiService.getCIIByMMSI(mmsi);
    res.status(200).json({
      message: 'Ais data fetched successfully',
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
