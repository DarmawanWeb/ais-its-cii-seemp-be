import bcrypt from 'bcryptjs';
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';
import { Role } from '../enums/role.enum';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../middlewares/error.middleware';
import { verifyRefreshToken } from '../utils/jwt';

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) => {
  const { name, email, password, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role || Role.GUEST;

  // Create the user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: userRole,
    active: true,
  });
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id, email: user.email });
  const refreshToken = generateRefreshToken({
    id: user._id,
    email: user.email,
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  const refreshTokenDoc = new RefreshToken({
    userId: user._id,
    token: hashedRefreshToken,
    expiresAt,
  });
  await refreshTokenDoc.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    id: user._id,
    email: user.email,
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  const refreshTokenDoc = new RefreshToken({
    userId: user._id,
    token: hashedRefreshToken,
    expiresAt,
  });
  await refreshTokenDoc.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (typeof decoded !== 'object' || !('id' in decoded)) {
      throw new AuthenticationError('Invalid refresh token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const storedToken = await RefreshToken.findOne({
      userId: user._id,
    });
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
      id: user._id,
      email: user.email,
    });
    return { accessToken: newAccessToken };
  } catch (error) {
    throw new AuthenticationError(`Token refresh failed with error ${error}`);
  }
};

export const logoutUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  await RefreshToken.deleteMany({ userId });
  return { message: 'User logged out successfully' };
};
