import ResponseModel from "../models/ResponseModel";
import { UserProfile } from "../models/UserProfile";
import { login, logout } from "../pageobjects/Login/LoginHelper";
import ProfilePage, { PROFILE_SELECTORS } from "../pageobjects/Profile/ProfilePage";
import { getProfileData } from "../pageobjects/Profile/ProfilePageHelper";
import { getBrowserInstance, getNewPage, goToUrl } from "../util/PuppeteerManager";
import { v4 as uuid } from 'uuid';
import { URL_CONSTANTS } from "../constants/URLConstants";
import path from "path";
import { deleteDirectory } from "../util/FileManager";

class ScrappingService {
    static async ScrapeUserData(body: {
        username: string,
        password: string
    }): Promise<ResponseModel> {
        const browser = await getBrowserInstance();

        const generatedUuid = uuid();
        const page = await getNewPage(browser);

        // each instance will have its own download folder
        await page['_client'].send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: path.resolve(__dirname, `../../tmp/${generatedUuid}`) });

        try {
            await goToUrl(page, URL_CONSTANTS.GLASSDOOR);

            await login(page, body);

            // HOME PAGE //
            const profileContainer = await page.waitForSelector('[data-test="profile-container"]');
            //sometimes it needs a bit more to load
            await page.waitForTimeout(1000);
            await profileContainer!.evaluate((b: any) => b.click());

            // PROFILE PAGE //
            await page.waitForSelector(PROFILE_SELECTORS.DOWNLOAD_BUTTON);

            const downloadButton = await ProfilePage.getDownloadButton(page);
            await downloadButton.evaluate((b: any) => b.click());

            await page.waitForSelector(PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION);

            const userProfileData = await getProfileData(page, generatedUuid);

            const isPresent = await UserProfile.exists({ email: userProfileData.email });

            if (!isPresent) await UserProfile.create(userProfileData);
            else {
                const existingUserProfileData = await UserProfile.findOne({email : userProfileData.email});
                if(existingUserProfileData) {
                    await deleteDirectory(existingUserProfileData.url);
                }

                await UserProfile.replaceOne({ email: userProfileData.email }, userProfileData);
            }

            await logout(page);

            await page.close();
            await browser.close();

            return new ResponseModel().Success(userProfileData);
        } catch (err: any) {
            await page.close();
            await browser.close();

            return new ResponseModel().Failed({
                message: err.message,
                messageCode: "FAILED"
            });
        }

    }
}

export default ScrappingService;