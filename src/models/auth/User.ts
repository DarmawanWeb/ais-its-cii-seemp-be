import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Role } from '../../enums/role.enum';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
