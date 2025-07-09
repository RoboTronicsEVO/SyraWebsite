import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  address: string;
  contactEmail: string;
  website?: string;
  isVerified: boolean;
  memberCount: number;
  adminEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    logo: String,
    address: { type: String, required: true },
    contactEmail: { type: String, required: true },
    website: String,
    isVerified: { type: Boolean, default: false },
    memberCount: { type: Number, default: 0 },
    adminEmail: { type: String, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.School as Model<ISchool>) || mongoose.model<ISchool>('School', SchoolSchema); 