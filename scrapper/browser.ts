import puppeteer from 'puppeteer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import ProfilePage, { PROFILE_SELECTORS } from '../pageobjects/Profile/ProfilePage';
import {getData} from '../pageobjects/Profile/ProfilePageHelper';
import { UserProfile } from '../models/UserProfile';

class Browser {
	async crawl(url: string, body: { username: string, password: string }): Promise<void> {
		try {
			console.log('### Crawl started ###')

			// we use --start-maximized to standardize viewport to max resolution, so the execution is always idempotent
			const browser = await puppeteer.launch({
				headless: false,
				args: ['--start-maximized'],
				defaultViewport: null,
				dumpio: true
			});

			const generatedUuid = uuid();
			const page = await browser.newPage();

			await page['_client'].send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: path.resolve(__dirname, `../tmp/${generatedUuid}`) });

			await page.goto(url, {
				waitUntil: 'domcontentloaded',
			});

			await page.waitForSelector('button.LockedHomeHeaderStyles__signInButton');

			await page.waitForTimeout(1000);

			await page.evaluate(() => {
				(document.querySelector('button.LockedHomeHeaderStyles__signInButton') as HTMLElement).click();
			});

			// for this type of input, evaluate will not work
			const username = await page.waitForSelector('[name="username"]');
			await username?.focus();
			await page.keyboard.type(body.username, {
				delay: 1
			});

			const password = await page.waitForSelector('[name="password"]');
			await password!.focus();
			await page.keyboard.type(body.password, {
				delay: 1
			});

			await page.evaluate(() => {
				(document.querySelector('button[name="submit"]') as HTMLElement).click();
			});

			const profileContainer = await page.waitForSelector('[data-test="profile-container"]');
			//sometimes it needs a bit more to load
			await page.waitForTimeout(1000);
			await profileContainer!.evaluate((b: any) => b.click());

			// HOME PAGE //

			// PROFILE PAGE //
			await page.waitForSelector(PROFILE_SELECTORS.DOWNLOAD_BUTTON);

			const downloadButton = await ProfilePage.getDownloadButton(page);
			// await downloadButton.evaluate((b : any) => b.click());

			await page.waitForSelector(PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION);

			const userProfileData = await getData(page, generatedUuid);
			
			const isPresent = await UserProfile.exists({ email: userProfileData.email });

			if(!isPresent) await UserProfile.create(userProfileData);
			else await UserProfile.replaceOne({email : userProfileData.email}, userProfileData);
			
			await page.close();
			await browser.close();

			return;
		} catch (err) {
			console.log(err);
		}

	}
}

export default new Browser();