import mongoose, { Model, Schema, Document } from 'mongoose';

type EducationDocument = Document & EducationSkelet;

export type EducationSkelet = {
    institutionName: string;
    level: string;
    location: string;
    period: string;
    description: string;
}

const EducationSchema = new Schema(
    {
        institutionName: {
            type: Schema.Types.String,
            required: true
        },
        level: {
            type: Schema.Types.String,
            required: true
        },
        location: {
            type: Schema.Types.String
        },
        period: {
            type: Schema.Types.String
        },
        description: {
            type: Schema.Types.String
        }
    },
    {
        collection: 'Educations',
        timestamps: true,
    },
);

const Education: Model<EducationDocument> = mongoose.model<EducationDocument>('Education', EducationSchema);

export { Education, EducationDocument, EducationSchema };