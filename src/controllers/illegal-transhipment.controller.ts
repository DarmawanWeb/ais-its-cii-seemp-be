import { Request, Response } from 'express';
import { AisService } from '../services/ais.service';
import { IllegalTranshipmentQueueRepository } from '../repositories/illegal-transhipment/it-queue.repository';
import { handleError } from '../utils/error.handler';

const aisService = new AisService();
const queueRepository = new IllegalTranshipmentQueueRepository();

export const getAllResultsController = async (_req: Request, res: Response) => {
  try {
    const results = await aisService.getIllegalTranshipmentResults();
    res.status(200).json({
      message: 'All illegal transhipment results fetched successfully',
      data: results,
      total: results.length,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getResultsByShipController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi } = req.params;
  try {
    const results = await aisService.getIllegalTranshipmentResultsByShip(mmsi);
    res.status(200).json({
      message: `Illegal transhipment results for ship ${mmsi} fetched successfully`,
      data: results,
      total: results.length,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getQueueStatusController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const queue = await queueRepository.getAllSorted();

    res.status(200).json({
      message: 'Queue status fetched successfully',
      data: {
        total: queue.length,
        pending: queue.filter((q) => q.status === 'pending').length,
        in_progress: queue.filter((q) => q.status === 'in_progress').length,
        queue: queue,
      },
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getQueueByShipsController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi1, mmsi2 } = req.params;
  try {
    const queueItem = await queueRepository.getByMMSI(mmsi1, mmsi2);

    if (!queueItem) {
      res.status(404).json({
        message: 'Queue item not found',
        success: false,
      });
      return;
    }

    res.status(200).json({
      message: 'Queue item fetched successfully',
      data: queueItem,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
