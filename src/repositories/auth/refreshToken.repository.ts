import { type IRefreshToken } from '../../types/auth.types';
import RefreshToken from '../../models/auth/RefreshToken';
import bcrypt from 'bcryptjs';

export interface IRefreshTokenRepository {
  create(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<IRefreshToken>;
  findByUserId(userId: string): Promise<IRefreshToken | null>;
  deleteByUserId(userId: string): Promise<void>;
}

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<IRefreshToken> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshTokenDoc = new RefreshToken({
      userId,
      token: hashedRefreshToken,
      expiresAt,
    });
    await refreshTokenDoc.save();
    return {
      userId: refreshTokenDoc.userId.toString(),
      token: refreshTokenDoc.token,
      expiresAt: refreshTokenDoc.expiresAt,
    };
  }

  async findByUserId(userId: string): Promise<IRefreshToken | null> {
    return await RefreshToken.findOne({ userId });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await RefreshToken.deleteMany({ userId });
  }
}
