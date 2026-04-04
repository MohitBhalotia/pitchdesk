import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPitchDeckSlide {
  slideType: string;
  order: number;
  heading?: string;
  subheading?: string;
  bodyText?: string;
  bulletPoints?: string[];
  metrics?: Array<{ label: string; value: string }>;
  teamMembers?: Array<{ name: string; role: string; bio: string }>;
  chartData?: {
    type: string;
    labels: string[];
    values: number[];
  };
  callToAction?: string;
  notes?: string;
  decorativeElements?: Array<{
    type: "divider" | "accent-bar" | "circle" | "quote-box";
    position: "top" | "bottom" | "left" | "right" | "center";
    color?: string;
  }>;
  images?: Array<{
    url: string;
    publicId?: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface IPitchDeck extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  templateId: string;
  slides: IPitchDeckSlide[];
  companyData: Record<string, string>;
  status: "generating" | "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const slideSchema = new Schema(
  {
    slideType: { type: String, required: true },
    order: { type: Number, required: true },
    heading: String,
    subheading: String,
    bodyText: String,
    bulletPoints: [String],
    metrics: [
      {
        label: String,
        value: String,
      },
    ],
    teamMembers: [
      {
        name: String,
        role: String,
        bio: String,
      },
    ],
    chartData: {
      type: { type: String },
      labels: [String],
      values: [Number],
    },
    callToAction: String,
    notes: String,
    decorativeElements: [
      {
        type: { type: String, enum: ["divider", "accent-bar", "circle", "quote-box"] },
        position: { type: String, enum: ["top", "bottom", "left", "right", "center"] },
        color: String,
      },
    ],
    images: [
      {
        url: String,
        publicId: String,
        x: Number,
        y: Number,
        width: Number,
        height: Number,
      },
    ],
  },
  { _id: false }
);

const pitchDeckSchema = new Schema<IPitchDeck>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Deck",
    },
    templateId: {
      type: String,
      required: true,
      default: "modern-dark",
    },
    slides: [slideSchema],
    companyData: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["generating", "draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const PitchDeckModel: Model<IPitchDeck> =
  mongoose.models.PitchDeck ||
  mongoose.model<IPitchDeck>("PitchDeck", pitchDeckSchema);

export default PitchDeckModel;
