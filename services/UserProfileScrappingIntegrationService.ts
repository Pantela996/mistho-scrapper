import ResponseModel from '../models/ResponseModel';
import { login, logout } from '../pageobjects/Login/LoginHelper';
import { getProfileData } from '../pageobjects/Profile/ProfilePageHelper';
import { goToUrl } from '../util/PuppeteerManager';
import { v4 as uuid } from 'uuid';
import { URL_CONSTANTS } from '../constants/URLConstants';
import path from 'path';
import { cluster } from '../util/PuppeteerCluster';
import UserProfileService from './UserProfileService';
import { HOME_SELECTORS } from '../pageobjects/Home/HomePageSelectors';

class ScrappingService {
  static async ScrapeUserData(body: {
    username: string;
    password: string;
  }): Promise<ResponseModel> {
    try {
      const generatedUuid = uuid();

      // prepare puppeteer cluster task
      await cluster.task(async ({ page }) => {
        try {
          // each instance will have its own download folder
          await page['_client'].send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: path.resolve(__dirname, `../../tmp/${generatedUuid}`),
          });

          await goToUrl(page, URL_CONSTANTS.GLASSDOOR);

          await login(page, body);

          // HOME PAGE
          const profileContainer = await page.waitForSelector(
            HOME_SELECTORS.PROFILE_CONTAINER
          );

          //sometimes it needs a bit more to load
          await page.waitForTimeout(1000);
          await profileContainer!.evaluate((b: any) => b.click());

          // PROFILE PAGE
          const userProfileData = await getProfileData(page, generatedUuid);
          await UserProfileService.saveOrUpdateUser(userProfileData);

          await logout(page);

          // HOME PAGE
          await page.close();
          
          return userProfileData;
        } catch (err: any) {
          await page.close();

          throw new Error(err.message);
        }
      });

      // execute puppeteer task
      const result = await cluster.execute(URL_CONSTANTS.GLASSDOOR);

      await cluster.idle();
      await cluster.close();
      return new ResponseModel().Success(result);
    } catch (err : any) {
      console.log(err);
      return new ResponseModel().Failed({message : err.message, messageCode : 'FAILED'}, 500);
    }
  }
}

export default ScrappingService;
