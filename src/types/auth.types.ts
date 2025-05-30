import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
}

export interface IJwtPayload {
  id: string;
  email: string;
}

export interface IRefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}
