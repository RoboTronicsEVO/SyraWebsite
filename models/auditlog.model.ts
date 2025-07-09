import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminEmail: string;
  action: string;
  targetUserId: mongoose.Types.ObjectId;
  targetUserEmail: string;
  details?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminEmail: { type: String, required: true },
  action: { type: String, required: true },
  targetUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetUserEmail: { type: String, required: true },
  details: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default (mongoose.models.AuditLog as Model<IAuditLog>) || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema); 