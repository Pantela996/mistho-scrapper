import ResponseModel from '../models/ResponseModel';
import { UserProfile } from '../models/UserProfile';
import { login, logout } from '../pageobjects/Login/LoginHelper';
import ProfilePage, {
  PROFILE_SELECTORS,
} from '../pageobjects/Profile/ProfilePage';
import { getProfileData } from '../pageobjects/Profile/ProfilePageHelper';
import {
  getBrowserInstance,
  getNewPage,
  goToUrl,
} from '../util/PuppeteerManager';
import { v4 as uuid } from 'uuid';
import { URL_CONSTANTS } from '../constants/URLConstants';
import path from 'path';
import { deleteDirectory } from '../util/FileManager';
import { cluster } from '../util/PuppeteerCluster';
import UserProfileService from './UserProfileService';

class ScrappingService {
  static async ScrapeUserData(body: {
    username: string;
    password: string;
  }): Promise<ResponseModel> {
    try {
      const generatedUuid = uuid();

      await cluster.task(async ({ page, data }) => {
        try {
          // each instance will have its own download folder
          await page['_client'].send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: path.resolve(__dirname, `../../tmp/${generatedUuid}`),
          });

          await goToUrl(page, URL_CONSTANTS.GLASSDOOR);

          await login(page, body);

          // HOME PAGE //
          const profileContainer = await page.waitForSelector(
            '[data-test="profile-container"]'
          );

          //sometimes it needs a bit more to load
          await page.waitForTimeout(1000);
          await profileContainer!.evaluate((b: any) => b.click());

          // PROFILE PAGE
          const userProfileData = await getProfileData(page, generatedUuid);
          await UserProfileService.saveOrUpdateUser(userProfileData);

          await logout(page);

          await page.close();

          return userProfileData;
        } catch (err: any) {
          await page.close();

          return new ResponseModel().Failed({
            message: err.message,
            messageCode: 'FAILED',
          });
        }
      });

      const result = await cluster.execute(URL_CONSTANTS.GLASSDOOR);
      return new ResponseModel().Success(result);
    } catch (err) {
      console.log(err);
      return new ResponseModel().Failed((err as any).message);
    }
  }
}

export default ScrappingService;
