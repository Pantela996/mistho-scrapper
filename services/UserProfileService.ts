import { UserProfile, UserProfileSkelet } from '../models/UserProfile';
import ResponseModel from '../models/ResponseModel';
import { deleteDirectory } from '../util/FileManager';

class UserProfileService {
  static async getUserProfile(email: string) {
    const res = await UserProfile.findOne({ email: email });

    if (!res)
      return new ResponseModel().Failed({
        message: 'User not found',
        messageCode: 'FAILED',
      });
    return res;
  }

  static async getAllUsersProfiles() {
    const res = await UserProfile.find({});

    if (!res)
      return new ResponseModel().Failed({
        message: 'User not found',
        messageCode: 'FAILED',
      });

    return res;
  }

  static async saveOrUpdateUser(
    userProfileData: UserProfileSkelet
  ): Promise<void> {
    const isPresent = await UserProfile.exists({
      email: userProfileData.email,
    });

    await UserProfile.create(userProfileData);
    if (!isPresent) await UserProfile.create(userProfileData);
    else {
      const existingUserProfileData = await UserProfile.findOne({
        email: userProfileData.email,
      });
      if (existingUserProfileData) {
        await deleteDirectory(existingUserProfileData.url);
      }

      await UserProfile.replaceOne(
        { email: userProfileData.email },
        userProfileData
      );
    }
  }
}

export default UserProfileService;
