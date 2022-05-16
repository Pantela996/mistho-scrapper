import { UserProfile } from "../models/UserProfile";
import ResponseModel from "../models/ResponseModel";

class UserProfileService {
    static async getUserProfile(email : string) {
        const res = await UserProfile.findOne({email : email});

        if(!res) return new ResponseModel().Failed({
            message: 'User not found',
            messageCode: "FAILED"
        })
        return res;
    }

    static async getAllUsersProfiles() {
        const res = await UserProfile.find({});

        if(!res) return new ResponseModel().Failed({
            message: 'User not found',
            messageCode: "FAILED"
        });
        
        return res;
    }
}

export default UserProfileService;