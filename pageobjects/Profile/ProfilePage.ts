import { ElementHandle, Page } from "puppeteer";

export enum PROFILE_SELECTORS  {
    DOWNLOAD_BUTTON = 'button.profileInfoStyle__actionBtn___2ectR',
    MAIN_PROFILE_INFO_SECTION = '.profileInfoStyle__profileInfoMain___Y8O5Z'
}  

class ProfilePage {
    async getDownloadButton(page : Page): Promise<ElementHandle<Element>> {
        return (await page.$$(PROFILE_SELECTORS.DOWNLOAD_BUTTON))[1];
    }

    async getInfoSection(page : Page): Promise<ElementHandle<Element>[]> {
        return (await page.$$(PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION));
    }

}  

export default new ProfilePage();