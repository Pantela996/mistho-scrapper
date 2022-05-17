import { Page } from 'puppeteer';
import InvalidCredentialsException from '../../exceptions/InvalidCredentialsException';
import { LOGIN_SELECTORS } from './LoginSelectors';

const login = async (
  page: Page,
  body: { username: string; password: string }
): Promise<void> => {
  try {
    await page.waitForSelector('button.LockedHomeHeaderStyles__signInButton');
    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      (
        document.querySelector(
          'button.LockedHomeHeaderStyles__signInButton'
        ) as HTMLElement
      ).click();
    });

    // for this type of input, evaluate will not work
    const username = await page.waitForSelector('[name="username"]');
    await username?.focus();
    await page.keyboard.type(body.username, {
      delay: 1,
    });

    const password = await page.waitForSelector('[name="password"]');
    await password!.focus();
    await page.keyboard.type(body.password, {
      delay: 1,
    });

    await page.evaluate(() => {
      (document.querySelector('button[name="submit"]') as HTMLElement).click();
    });

    // 5 seconds to be sure that enough time elapsed, if its error. If its not error we are not waiting for it
    await page.waitForNavigation({
      timeout: 10000,
    });
  } catch (err: any) {
    if (err.name === 'TimeoutError')
      throw new InvalidCredentialsException('Invalid credentials');
    console.log(err);
  }
};

const logout = async (page: Page): Promise<void> => {
  return await page.evaluate(async () => {
    (document.querySelector(LOGIN_SELECTORS.LOGOUT) as HTMLElement).click();
  });
};

export { login, logout };
