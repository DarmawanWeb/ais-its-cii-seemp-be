import type { Request, Response } from 'express';
import { handleError } from '../../utils/error.handler';
import { CIIService } from '../../services/cii/cii.service';

const ciiService = new CIIService();
export const getCIIByMmsiController = async (req: Request, res: Response) => {
  try {
    const { mmsi } = req.params;
    const ciiResult = await ciiService.getCIIByMMSI(mmsi);
    res.status(200).json({
      data: ciiResult,
      message: `CII data for MMSI ${mmsi} fetched successfully`,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
