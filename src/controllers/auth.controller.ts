import { Request, Response } from 'express';
import { handleError } from '../utils/error.handler';
import { validationResult } from 'express-validator';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from '../services/auth.service';

export const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        message: 'Validation error',
        errors: errors.array(),
        success: false,
      });
    }
    const { name, email, password, role } = req.body;
    const result = await registerUser({ name, email, password, role });
    res.status(200).json({
      message: 'User registered successfully',
      data: result,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        message: 'Validation error',
        errors: errors.array(),
        success: false,
      });
    }
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await loginUser(
      email,
      password,
    );
    res.status(200).json({
      message: 'User logged in successfully',
      data: { accessToken, refreshToken, user },
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const refreshController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const { accessToken } = await refreshAccessToken(refreshToken);
    res.status(200).json({
      message: 'Access token refreshed successfully',
      data: { accessToken },
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const result = await logoutUser(userId);
    res.status(200).json({
      message: 'User logged out successfully',
      data: result,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
