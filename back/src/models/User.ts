import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../types';

const UserSchema: Schema<IUser> = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;