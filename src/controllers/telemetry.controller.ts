import { Request, Response } from 'express';
import { TelemetryService } from '../services/telemetry.service';
import { handleError } from '../utils/error.handler';

const telemetryService = new TelemetryService();

export const createTelemetryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const telemetry = await telemetryService.createTelemetry(req.body);
    res.status(201).json({
      message: 'Telemetry created successfully',
      data: telemetry,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllTelemetryController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const telemetry = await telemetryService.getAllTelemetry();
    res.status(200).json({
      message: 'All telemetry fetched successfully',
      data: telemetry,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getTelemetryByMmsiController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi } = req.params;
  try {
    const telemetry = await telemetryService.getTelemetryByMmsi(mmsi);
    if (!telemetry) {
      res.status(404).json({
        message: 'Telemetry data not found for MMSI',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Telemetry fetched successfully',
        data: telemetry,
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateTelemetryController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi } = req.params;
  try {
    const updatedTelemetry = await telemetryService.updateTelemetry(
      mmsi,
      req.body,
    );
    if (!updatedTelemetry) {
      res.status(404).json({
        message: 'Telemetry not found for MMSI',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Telemetry updated successfully',
        data: updatedTelemetry,
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteTelemetryController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi } = req.params;
  try {
    const deletedTelemetry = await telemetryService.deleteTelemetry(mmsi);
    if (!deletedTelemetry) {
      res.status(404).json({
        message: 'Telemetry not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Telemetry deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateFuelConsumptionByMMSIController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi } = req.params;
  const fuelData = req.body;
  try {
    const updatedTelemetry = await telemetryService.updateFuelConsumptionByMMSI(
      mmsi,
      fuelData,
    );
    if (!updatedTelemetry) {
      res.status(404).json({
        message: 'Telemetry not found for MMSI, creating new entry',
        success: true,
        data: updatedTelemetry,
      });
    } else {
      res.status(200).json({
        message: 'Fuel data added successfully',
        data: updatedTelemetry,
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
