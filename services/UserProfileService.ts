import {
  UserProfile,
  UserProfileDocument,
  UserProfileSkelet,
} from '../models/UserProfile';
import ResponseModel from '../models/ResponseModel';
import { deleteDirectory } from '../util/FileManager';

class UserProfileService {
  static async getUserProfile(
    email: string
  ): Promise<ResponseModel> {
    try {
      const res = await UserProfile.findOne({ email: email });

      if (!res)
        return new ResponseModel().Failed(
          {
            message: 'User not found',
            messageCode: 'FAILED',
          },
          404
        );
      return new ResponseModel().Success(res);
    } catch (err: any) {
      return new ResponseModel().Failed(
        {
          message: err.message,
          messageCode: 'FAILED',
        },
        500
      );
    }
  }

  static async getAllUsersProfiles(): Promise<ResponseModel> {
    try {
      const res = await UserProfile.find({});
      return new ResponseModel().Success(res);
    } catch (err: any) {
      return new ResponseModel().Failed(
        {
          message: err.message,
          messageCode: 'FAILED',
        },
        500
      );
    }
  }

  static async saveOrUpdateUser(
    userProfileData: UserProfileSkelet
  ): Promise<void | ResponseModel> {
    try {
      const isPresent = await UserProfile.exists({
        email: userProfileData.email,
      });

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
    } catch (err: any) {
      return new ResponseModel().Failed(
        {
          message: err.message,
          messageCode: 'FAILED',
        },
        500
      );
    }
  }
}

export default UserProfileService;
