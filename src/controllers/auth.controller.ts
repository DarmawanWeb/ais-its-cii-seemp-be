import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { handleError } from '../utils/error.handler';
import { AuthService } from '../services/auth.service';
import { RefreshTokenRepository } from '../repositories/auth/refreshToken.repository';
import { UserRepository } from '../repositories/auth/user.repository';

const authService = new AuthService(
  new UserRepository(),
  new RefreshTokenRepository(),
);

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
      return;
    }
    const { name, email, password, role } = req.body;
    const result = await authService.register({ name, email, password, role });
    res.status(200).json({
      message: 'User registered successfully',
      data: result,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const loginController = async (
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
      return;
    }
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      message: 'User logged in successfully',
      data: result,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const refreshController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({
      message: 'Access token refreshed successfully',
      data: result,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.body;
    const result = await authService.logout(userId);
    res.status(200).json({
      message: 'User logged out successfully',
      data: result,
      success: true,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
};
