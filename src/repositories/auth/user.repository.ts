import { type IUser } from '../../models/auth/User';
import User from '../../models/auth/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(user: Partial<IUser>): Promise<IUser>;
}

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = new User(user);
    await newUser.save();
    return newUser as IUser;
  }
}
