import { Request, Response } from 'express';
import { AnnualCIIService } from '../../services/cii/annualcii.service';
import { handleError } from '../../utils/error.handler';

const annualCiiService = new AnnualCIIService();

export const createAnnualCiiController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi, ciiData } = req.body;
  try {
    const newAnnualCii = await annualCiiService.createAnnualCii(mmsi, ciiData);
    res.status(201).json({
      message: 'Annual Cii created successfully',
      data: newAnnualCii,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllAnnualCiiController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const annualCiiRecords = await annualCiiService.getAllAnnualCii();
    res.status(200).json({
      message: 'All Annual Cii records fetched successfully',
      data: annualCiiRecords,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAnnualCiiByMmsiController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi } = req.params;
  try {
    const annualCiiRecord = await annualCiiService.getAnnualCiiByMmsi(mmsi);
    res.status(200).json({
      message: 'Annual Cii record fetched successfully',
      data: annualCiiRecord,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAnnualCiiByMmsiAndYearController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi, year } = req.params;
  try {
    const annualCiiRecord = await annualCiiService.getAnnualCiiByMmsiAndYear(
      mmsi,
      parseInt(year),
    );
    if (!annualCiiRecord) {
      res.status(404).json({
        message: 'Annual Cii record for the given year not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Annual Cii record fetched successfully',
        data: annualCiiRecord,
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updateAnnualCiiController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi, year } = req.params;
  try {
    const updatedAnnualCii = await annualCiiService.updateAnnualCii(
      mmsi,
      parseInt(year),
      req.body,
    );
    res.status(200).json({
      message: 'Annual Cii updated successfully',
      data: updatedAnnualCii,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deleteAnnualCiiController = async (
  req: Request,
  res: Response,
) => {
  const { mmsi } = req.params;
  try {
    const deletedAnnualCii = await annualCiiService.deleteAnnualCii(mmsi);
    if (!deletedAnnualCii) {
      res.status(404).json({
        message: 'Annual Cii record not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Annual Cii record deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
