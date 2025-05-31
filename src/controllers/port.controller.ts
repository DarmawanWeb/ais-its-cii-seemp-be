import { Request, Response } from 'express';
import { PortService } from '../services/port.service';
import { handleError } from '../utils/error.handler';

const portService = new PortService();

export const createPortController = async (req: Request, res: Response) => {
  try {
    const Port = await portService.createPort(req.body);
    res.status(201).json({
      message: 'Port created successfully',
      data: Port,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getAllPortsController = async (_req: Request, res: Response) => {
  try {
    const Ports = await portService.getAllPorts();
    res.status(200).json({
      message: 'All Ports fetched successfully',
      data: Ports,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getPortByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const Port = await portService.getPortById(id);
    res.status(200).json({
      message: 'Port fetched successfully',
      data: Port,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const updatePortController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedPort = await portService.updatePort(id, req.body);
    res.status(200).json({
      message: 'Port updated successfully',
      data: updatedPort,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const deletePortController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedPort = await portService.deletePort(id);
    if (!deletedPort) {
      res.status(404).json({
        message: 'Port not found',
        success: false,
      });
    } else {
      res.status(200).json({
        message: 'Port deleted successfully',
        success: true,
      });
    }
  } catch (error: unknown) {
    handleError(error, res);
  }
};
