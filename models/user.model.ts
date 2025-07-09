import mongoose, { Document, Model, Schema, CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  role: string; // 'user', 'school-admin', 'admin', etc.
  verified: boolean;
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true, select: false },
    image: String,
    role: { type: String, default: 'user' },
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function (this: IUser & Document, next: CallbackWithoutResultAndOptionalError) {
  const nextFn = next;
  const user = this;
  if (!user.isModified || !user.isModified('password')) return nextFn();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  nextFn();
});

UserSchema.methods.comparePassword = async function (this: IUser, candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const UserModel = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default UserModel;