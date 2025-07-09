import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITeamMember {
  userId: mongoose.Types.ObjectId;
  role: 'captain' | 'member' | 'mentor';
  joinedAt: Date;
}

export interface ITeam extends Document {
  name: string;
  description?: string;
  schoolId: mongoose.Types.ObjectId;
  captainId: mongoose.Types.ObjectId;
  members: ITeamMember[];
  competitionId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['captain', 'member', 'mentor'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
});

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    description: String,
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    captainId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: { type: [TeamMemberSchema], default: [] },
    competitionId: { type: Schema.Types.ObjectId, ref: 'Competition' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Team as Model<ITeam>) || mongoose.model<ITeam>('Team', TeamSchema); 