import mongoose, { Model,Document, Schema } from 'mongoose';

export interface ISupportTicket extends Document {
  name?: string;
  email: string;
  issueType: 'account' | 'billing' | 'bug' | 'feature' | 'other';
  subject: string;
  description: string;
  status: 'submitted' | 'in-progress' | 'resolved';
  // files: string[]; // Array of file paths/URLs
  consent: boolean;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  name: {
    type: String,
    required: false,
    default: '',
  },
  email: {
    type: String,
    required: true,
    
  },
  issueType: {
    type: String,
    required: true,
    enum: ['account', 'billing', 'bug', 'feature', 'other'],
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
  },
  status: {
    type: String,
    required: true,
    enum: ['submitted', 'in-progress', 'resolved'],
    default: 'submitted',
  },
  // files: [{
  //   type: String,
  //   required: false,
  // }],
  consent: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

// Prevent recompilation of model
const SupportTicketModel:Model<ISupportTicket> = mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);

export default SupportTicketModel;
