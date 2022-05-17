import mongoose, { Model, Schema, Document } from 'mongoose';

type ExperienceDocument = Document & ExperienceSkelet;

export type ExperienceSkelet = {
  role: string;
  companyName: string;
  period: string;
  location: string;
  description: string;
};

const ExperienceSchema = new Schema(
  {
    role: {
      type: Schema.Types.String,
      required: true,
    },
    companyName: {
      type: Schema.Types.String,
      required: true,
    },
    location: {
      type: Schema.Types.String,
    },
    period: {
      type: Schema.Types.String,
    },
    description: {
      type: Schema.Types.String,
    },
  },
  {
    collection: 'Experiences',
    timestamps: true,
  }
);

const Experience: Model<ExperienceDocument> =
  mongoose.model<ExperienceDocument>('Experience', ExperienceSchema);

export { Experience, ExperienceDocument, ExperienceSchema };
