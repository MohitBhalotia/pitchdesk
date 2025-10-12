import mongoose, { Model,Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  name?: string;
  email?: string;
  feedbackType: 'bug' | 'feature' | 'suggestion' | 'praise';
  rating: number;
  message: string;
  contactPreference: boolean;
}

const FeedbackSchema = new Schema<IFeedback>({
  name: {
    type: String,
    required: false,
    default: '',
  },
  email: {
    type: String,
    required: false,
    default: '',
  },
  feedbackType: {
    type: String,
    required: true,
    enum: ['bug', 'feature', 'suggestion', 'praise'],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  message: {
    type: String,
    required: true,
    minlength: 10,
  },
  contactPreference: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

const FeedbackModel:Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default FeedbackModel;
