import mongoose, { Model, Schema, Document } from 'mongoose';

type CertificationDocument = Document & CertificationSkelet;

export type CertificationSkelet = {
    certificateName: string;
    certificateIssuer: string;
    period: string;
    description: string;
}

const CertificationSchema = new Schema(
    {
        certificateName: {
            type: Schema.Types.String,
            required: true
        },
        certificateIssuer: {
            type: Schema.Types.String,
            required: true
        },
        period: {
            type: Schema.Types.String
        },
        description: {
            type: Schema.Types.String
        }
    },
    {
        collection: 'Certifications',
        timestamps: true,
    },
);

const Certification: Model<CertificationDocument> = mongoose.model<CertificationDocument>('Certification', CertificationSchema);

export { Certification, CertificationDocument, CertificationSchema };