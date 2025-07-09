import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICompetition extends Document {
  name: string;
  description: string;
  type: string;
  level: string;
  status: string;
  registrationDeadline: Date;
  startDate: Date;
  endDate: Date;
  maxTeams?: number;
  currentTeams: number;
  prizes?: string[];
  rules: string;
  organizerId: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  registeredTeams: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CompetitionSchema = new Schema<ICompetition>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: String, required: true },
  status: { type: String, required: true },
  registrationDeadline: { type: Date, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxTeams: { type: Number },
  currentTeams: { type: Number, default: 0 },
  prizes: [String],
  rules: { type: String, required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School' },
  registeredTeams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
}, { timestamps: true });

export default (mongoose.models.Competition as Model<ICompetition>) || mongoose.model<ICompetition>('Competition', CompetitionSchema); 