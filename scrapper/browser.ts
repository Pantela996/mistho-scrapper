import puppeteer from 'puppeteer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import ProfilePage, { PROFILE_SELECTORS } from '../pageobjects/Profile/ProfilePage';

class Browser {
	async crawl(url : string, body : {username : string, password : string}) : Promise<void> {
		try {
			console.log('### Crawl started ###')

			// we use --start-maximized to standardize viewport to max resolution, so the execution is always idempotent
			const browser = await puppeteer.launch({
				headless: false,
				args: ['--start-maximized'],
				defaultViewport: null
			});

			const generatedUuid = uuid();
			const page = await browser.newPage();

			let fileName = '';

			// page.on('response', intercept => {
			// 	const pdfDisposition = intercept.headers()['content-disposition'];
			// 	if(pdfDisposition && pdfDisposition.includes('pdf')){
			// 		page.waitForNavigation({ waitUntil: 'networkidle0' })
			// 		const pdfName = pdfDisposition.split(';')[1].split('=')[1];
			// 		const slicedName = pdfName.slice(1,pdfName.length - 1);
			// 		fs.rename(`${path.resolve(__dirname, '../tmp')}/${slicedName}`, `${path.resolve(__dirname, '../tmp')}/123.pdf`, (err) => {
			// 			if(err) console.log(err);
			// 			console.log('done!');
			// 		});
			// 	}
			// });

			// await page._client.on('Page.downloadWillBegin', ({ url, suggestedFilename }) => {
			// 	console.log('download beginning,', url, suggestedFilename);
			// 	//fileName = suggestedFilename;
			//   });
			
			//   await page._client.on('Page.downloadProgress', ({ state }) => {
			// 	if (state === 'completed') {
			// 	  console.log('download completed. File location: ', downloadPath + '/' + fileName);
			// 	}
			//   });

			await page['_client'].send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: path.resolve(__dirname, `../tmp/${generatedUuid}`)});
	
			await page.goto(url, {
				waitUntil: 'domcontentloaded',
			});

			await page.waitForSelector('button.LockedHomeHeaderStyles__signInButton');
			// Scrape some selectors
			let headline = (await page.$$('button.LockedHomeHeaderStyles__signInButton'))[0];
			if(headline) await headline.evaluate((b : any) => b.click());

			const usernameInput = await (await page.waitForXPath('//*[@id="LoginModal"]/div/div/div[2]/div[2]/div[2]/div/div/form/div[1]/label'))!.focus();
			await page.keyboard.type(body.username, {
				delay: 1
			});

			const passwordInput = await (await page.waitForXPath('//*[@id="modalUserPassword"]'))!.focus(); 
			await page.keyboard.type(body.password, {
				delay:1
			});

			const submitButton = await page.$('button[name="submit"]');
			await submitButton!.click();

			const profileContainer = await page.waitForSelector('[data-test="profile-container"]');
			await profileContainer!.click();

						
			// HOME PAGE //

			// PROFILE PAGE //
			await page.waitForSelector(PROFILE_SELECTORS.DOWNLOAD_BUTTON);

			const downloadButton = await ProfilePage.getDownloadButton(page);
			// await downloadButton.evaluate((b : any) => b.click());

			await page.waitForSelector(PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION);
			
			const profileInfoSection =	await ProfilePage.getInfoSection(page);

			const childs = await profileInfoSection[0]?.$$(':scope > *');

			const firstElem = await childs[0].$$('.profileInfoStyle__wrap___102WU');
			const role = await page.evaluate(el => el.textContent  ? el.textContent : '', firstElem[0]);
			const role2 = await page.evaluate(el => el.textContent  ? el.textContent : '', firstElem[1]);

			const secondElem = await childs[1].$$('.profileInfoStyle__wrap___102WU');
			const role3 = await page.evaluate(el => el ? el.textContent : '', secondElem[0]);
			//const role4 = await page.evaluate(el => el ? el.textContent : '', secondElem[1]);

			console.log(role, role2, role3);

			await browser.close();

			return;
		} catch(err) {
			console.log(err);
		}

	}
}

export default new Browser();