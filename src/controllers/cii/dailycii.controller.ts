import { Request, Response } from 'express';
import { DailyCIIService } from '../../services/cii/dailycii.service';
import { handleError } from '../../utils/error.handler';

const dailyCiiService = new DailyCIIService();

export const createDailyCiiController = async (req: Request, res: Response) => {
  const { mmsi, ciiData } = req.body;
  try {
    const newDailyCii = await dailyCiiService.createDailyCii(mmsi, ciiData);
    res.status(201).json({
      message: 'Daily Cii created successfully',
      data: newDailyCii,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllDailyCiiController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const dailyCiiRecords = await dailyCiiService.getAllDailyCii();
    res.status(200).json({
      message: 'All Daily Cii records fetched successfully',
      data: dailyCiiRecords,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getDailyCiiByMmsiController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi } = req.params;
  try {
    const dailyCiiRecord = await dailyCiiService.getDailyCiiByMmsi(mmsi);
    res.status(200).json({
      message: 'Daily Cii record fetched successfully',
      data: dailyCiiRecord,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getDailyCiiByMmsiAndTimestampController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi, timestamp } = req.params;
  try {
    const dailyCiiRecord = await dailyCiiService.getDailyCiiByMmsiAndTimestamp(
      mmsi,
      new Date(timestamp),
    );
    if (!dailyCiiRecord) {
      res.status(404).json({
        message: 'Daily Cii record for the given timestamp not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Daily Cii record fetched successfully',
        data: dailyCiiRecord,
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateDailyCiiController = async (req: Request, res: Response) => {
  const { mmsi, timestamp } = req.params;
  try {
    const updatedDailyCii = await dailyCiiService.updateDailyCii(
      mmsi,
      new Date(timestamp),
      req.body,
    );
    res.status(200).json({
      message: 'Daily Cii updated successfully',
      data: updatedDailyCii,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteDailyCiiController = async (req: Request, res: Response) => {
  const { mmsi } = req.params;
  try {
    const deletedDailyCii = await dailyCiiService.deleteDailyCii(mmsi);
    if (!deletedDailyCii) {
      res.status(404).json({
        message: 'Daily Cii record not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Daily Cii record deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
