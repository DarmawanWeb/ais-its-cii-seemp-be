import type { Request, Response } from 'express';
import { AisService } from '../services/ais.service';
import { handleError } from '../utils/error.handler';

const aisService = new AisService();

export const getAllAisController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const aisData = await aisService.getAllAisStreamed(6);
    res.status(200).json({
      message: 'AIS data (12h) fetched successfully',
      data: aisData,
      success: true,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getAisByMmsiController = async (
  req: Request<{ mmsi: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { mmsi } = req.params;
    const aisData = await aisService.getAisByMmsi(mmsi);

    if (!aisData) {
      res.status(404).json({
        message: 'AIS data not found',
        success: false,
      });
      return;
    }

    res.status(200).json({
      message: 'AIS data fetched successfully',
      data: aisData,
      success: true,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getTwoShipRoutesInSpecificTimeRangeController = async (
  req: Request<
    { mmsi1: string; mmsi2: string },
    unknown,
    unknown,
    { startTime: string; endTime: string }
  >,
  res: Response,
): Promise<void> => {
  try {
    const { mmsi1, mmsi2 } = req.params;
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      res.status(400).json({
        message: 'Missing startTime or endTime query parameters',
        success: false,
      });
      return;
    }

    const routeData = await aisService.getTwoShipRoutesInSpecificTimeRange(
      mmsi1,
      mmsi2,
      new Date(startTime),
      new Date(endTime),
    );

    res.status(200).json({
      message: 'Ship routes fetched successfully',
      data: routeData,
      success: true,
    });
  } catch (error) {
    handleError(error, res);
  }
};
