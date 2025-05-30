import type { Request, Response } from 'express';
import { handleError } from '../../utils/error.handler';

export const getCIIByMmsiController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { mmsi } = req.params;
    console.log(`Fetching CII data for MMSI: ${mmsi}`);
    // const aisData = await aisService.getAisByMmsi(mmsi);
    // if (!aisData) {
    //   res.status(404).json({
    //     message: 'Ais data not found',
    //     success: false,
    //   });
    //   return;
    // }
    res.status(200).json({
      message: 'Ais data fetched successfully',
      //   data: aisData,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
