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
exports.ExperienceSchema = exports.Experience = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ExperienceSchema = new mongoose_1.Schema({
    role: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    companyName: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    location: {
        type: mongoose_1.Schema.Types.String,
    },
    period: {
        type: mongoose_1.Schema.Types.String,
    },
    description: {
        type: mongoose_1.Schema.Types.String,
    },
}, {
    collection: 'Experiences',
    timestamps: true,
});
exports.ExperienceSchema = ExperienceSchema;
const Experience = mongoose_1.default.model('Experience', ExperienceSchema);
exports.Experience = Experience;
//# sourceMappingURL=Experience.js.map