"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Certification_1 = require("./Certification");
const Education_1 = require("./Education");
const Experience_1 = require("./Experience");
const userProfileSchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        index: true,
    },
    address: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    role: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        index: true,
    },
    website: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    phone: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    aboutMe: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    experience: {
        type: [Experience_1.ExperienceSchema],
        required: false,
    },
    mainSkills: {
        type: [mongoose_1.Schema.Types.String],
        required: false,
    },
    suggestedSkills: {
        type: [mongoose_1.Schema.Types.String],
        required: false,
    },
    education: {
        type: [Education_1.EducationSchema],
        required: false,
    },
    certification: {
        type: [Certification_1.CertificationSchema],
        required: false,
    },
    url: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    urlLink: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
}, {
    collection: 'userProfiles',
    timestamps: true,
});
const UserProfile = mongoose_1.default.model('User Profile', userProfileSchema);
exports.UserProfile = UserProfile;
//# sourceMappingURL=UserProfile.js.map