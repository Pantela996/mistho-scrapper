"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserProfile_1 = require("../models/UserProfile");
const ResponseModel_1 = __importDefault(require("../models/ResponseModel"));
const FileManager_1 = require("../util/FileManager");
class UserProfileService {
    static async getUserProfile(email) {
        const res = await UserProfile_1.UserProfile.findOne({ email: email });
        if (!res)
            return new ResponseModel_1.default().Failed({
                message: 'User not found',
                messageCode: 'FAILED',
            });
        return res;
    }
    static async getAllUsersProfiles() {
        const res = await UserProfile_1.UserProfile.find({});
        if (!res)
            return new ResponseModel_1.default().Failed({
                message: 'User not found',
                messageCode: 'FAILED',
            });
        return res;
    }
    static async saveOrUpdateUser(userProfileData) {
        const isPresent = await UserProfile_1.UserProfile.exists({
            email: userProfileData.email,
        });
        if (!isPresent)
            await UserProfile_1.UserProfile.create(userProfileData);
        else {
            const existingUserProfileData = await UserProfile_1.UserProfile.findOne({
                email: userProfileData.email,
            });
            if (existingUserProfileData) {
                await (0, FileManager_1.deleteDirectory)(existingUserProfileData.url);
            }
            await UserProfile_1.UserProfile.replaceOne({ email: userProfileData.email }, userProfileData);
        }
    }
}
exports.default = UserProfileService;
//# sourceMappingURL=UserProfileService.js.map