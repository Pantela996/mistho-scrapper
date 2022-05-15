import mongoose, { Model, Schema, Document } from 'mongoose';
import { Experience, ExperienceSchema } from './Experience';

type UserProfileDocument = Document & UserProfileSkelet;

export type UserProfileSkelet = {
    name: string;
    role: string;
    address: string;
    email: string;
    website: string;
    phone: string;
    aboutMe: string;
    experience: typeof Experience[];
    mainSkills: string[];
    suggestedSkills: string[];
    education: string[],
    certification: string[],
    url: string;
}

const userProfileSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            index: true,
        },
        address: {
            type: Schema.Types.String,
            required: true,
        },
        role: {
            type: Schema.Types.String,
            required: true,
        },
        email: {
            type: Schema.Types.String,
            required: true,
            index: true,
        },
        website: {
            type: Schema.Types.String,
            required: false,
        },
        phone: {
            type: Schema.Types.String,
            required: false,
        },
        aboutMe: {
            type: Schema.Types.String,
            required: false,
        },
        experience: {
            type: [ExperienceSchema],
            required: false,
        },
        mainSkills: {
            type: [Schema.Types.String],
            required: false,
        },
        suggestedSkills: {
            type: [Schema.Types.String],
            required: false,
        },
        education: {
            type: [Schema.Types.String],
            required: false,
        },
        certification: {
            type: [Schema.Types.String],
            required: false,
        },
        url: {
            type: Schema.Types.String,
            required: true
        }
    },
    {
        collection: 'userProfiles',
        timestamps: true,
    },
);

const UserProfile: Model<UserProfileDocument> = mongoose.model<UserProfileDocument>('User Profile', userProfileSchema);

export { UserProfile, UserProfileDocument };