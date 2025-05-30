import { Role } from '../enums/role.enum';

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
