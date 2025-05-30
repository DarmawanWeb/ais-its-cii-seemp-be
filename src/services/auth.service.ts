import bcrypt from 'bcryptjs';
import { type IUserRepository } from '../repositories/auth/user.repository';
import { type IRefreshTokenRepository } from '../repositories/auth/refreshToken.repository';
import { IAuthResponse } from '../types/auth.types';
import { Role } from '../enums/role.enum';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../middlewares/error.middleware';
import { verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }): Promise<IAuthResponse> {
    const { name, email, password, role } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || Role.GUEST;

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      active: true,
    });

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(email: string, password: string): Promise<IAuthResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      if (typeof decoded !== 'object' || !('id' in decoded)) {
        throw new AuthenticationError('Invalid refresh token');
      }

      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const storedToken = await this.refreshTokenRepository.findByUserId(
        user.id,
      );
      if (!storedToken) {
        throw new AuthenticationError('Refresh token not found');
      }

      const isValid = await bcrypt.compare(refreshToken, storedToken.token);
      if (!isValid) {
        throw new AuthenticationError('Invalid refresh token');
      }

      if (new Date() > storedToken.expiresAt) {
        throw new AuthenticationError('Refresh token has expired');
      }

      const newAccessToken = generateAccessToken({
        id: user.id,
        email: user.email,
      });
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new AuthenticationError(`Token refresh failed with error ${error}`);
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.refreshTokenRepository.deleteByUserId(user.id);
    return { message: 'User logged out successfully' };
  }
}
