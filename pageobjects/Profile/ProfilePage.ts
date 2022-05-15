import { ElementHandle, Page } from "puppeteer";

export enum PROFILE_SELECTORS {
    DOWNLOAD_BUTTON = 'button.profileInfoStyle__actionBtn___2ectR',
    MAIN_PROFILE_INFO_SECTION = '.profileInfoStyle__profileInfoMain___Y8O5Z',
    ABOUT_ME = '[data-test="AboutMeSection"]',
    EXPERIENCE = '[data-test="ExperienceSection"]',
    SKILLS = '#Skills > div',
    SECTION_HEADER = '[data-test="sectionHeader"]',
    EDUCATION_SECTION = '[data-test="EducationSection"]',
    CERTIFICATION_SECTION = '[data-test="CertificationSection"]'
}

class ProfilePage {
    async getDownloadButton(page: Page): Promise<ElementHandle<Element>> {
        return (await page.$$(PROFILE_SELECTORS.DOWNLOAD_BUTTON))[1];
    }

    async getAboutMe(page: Page): Promise<string | null> {
        return await page.$eval(PROFILE_SELECTORS.ABOUT_ME, (elem: Element) => elem ? elem.textContent : '');
    }

    async getExperienceSection(page: Page): Promise<ElementHandle<Element> | null> {
        return await page.$(PROFILE_SELECTORS.EXPERIENCE);
    }

    async getSkills(page: Page) : Promise<ElementHandle<Element> | null> {
        return await page.$(`#${PROFILE_SELECTORS.SKILLS} > div`);
    }

    async getInfoSection(page: Page): Promise<ElementHandle<Element> | null> {
        return await page.$(PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION);
    }

    async getProfileInfoFromColumn(page: Page, profileInfo: ElementHandle<Element>): Promise<string> {
        return await page.evaluate(el => el.textContent ? el.textContent : '', profileInfo);
    }
}

export default new ProfilePage();