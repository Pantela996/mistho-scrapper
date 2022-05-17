import { Browser, Page } from 'puppeteer';

const puppeteer = require('puppeteer');

// these methods represent wrappers around standard puppeteer methods

const getBrowserInstance = async (): Promise<Browser> => {
  // we use --start-maximized to standardize viewport to max resolution, so the execution is always idempotent
  return await puppeteer.launch({
    headless: true,
    args: ['--start-maximized'],
    defaultViewport: null,
    dumpio: false,
  });
};

const getNewPage = async (browser: Browser): Promise<Page> => {
  return await browser.newPage();
};

const goToUrl = async (page: Page, url: string): Promise<void> => {
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
};

export { getBrowserInstance, getNewPage, goToUrl };
