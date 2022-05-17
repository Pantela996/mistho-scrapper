import { Page } from 'puppeteer';

const goToUrl = async (page: Page, url: string): Promise<void> => {
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
};

export { goToUrl };
