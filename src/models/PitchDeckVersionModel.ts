import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPitchDeckVersion extends Document {
  deckId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  slides: unknown[];
  title: string;
  templateId: string;
  label?: string;
  createdAt: Date;
}

const versionSchema = new Schema<IPitchDeckVersion>(
  {
    deckId: { type: Schema.Types.ObjectId, ref: "PitchDeck", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slides: { type: [Schema.Types.Mixed], required: true },
    title: { type: String, required: true },
    templateId: { type: String, required: true },
    label: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

versionSchema.index({ deckId: 1, createdAt: -1 });

const PitchDeckVersionModel: Model<IPitchDeckVersion> =
  mongoose.models.PitchDeckVersion ||
  mongoose.model<IPitchDeckVersion>("PitchDeckVersion", versionSchema);

export default PitchDeckVersionModel;
