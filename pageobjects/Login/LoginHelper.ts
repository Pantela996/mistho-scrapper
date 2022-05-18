import { Page } from 'puppeteer';
import InvalidCredentialsException from '../../exceptions/InvalidCredentialsException';
import { LOGIN_SELECTORS } from './LoginSelectors';

const login = async (
  page: Page,
  body: { username: string; password: string }
): Promise<void> => {
  try {
    await page.waitForSelector(LOGIN_SELECTORS.LOGIN_BUTTON);
    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      (
        document.querySelector(LOGIN_SELECTORS.LOGIN_BUTTON) as HTMLElement
      ).click();
    });

    // for this type of input, evaluate will not work
    const username = await page.waitForSelector(LOGIN_SELECTORS.USERNAME_FIELD);
    await username?.focus();
    await page.keyboard.type(body.username, {
      delay: 1,
    });

    const password = await page.waitForSelector(LOGIN_SELECTORS.PASSWORD_FIELD);
    await password!.focus();
    await page.keyboard.type(body.password, {
      delay: 1,
    });

    await page.evaluate(() => {
      (
        document.querySelector(LOGIN_SELECTORS.SUBMIT_BUTTON) as HTMLElement
      ).click();
    });

    await page.waitForNavigation({waitUntil: 'networkidle2', timeout : 5000});
  } catch (err: any) {
    console.log(err.name);
    if(err.name === 'TimeoutError') {
      // pull error message if exists
      const errorMessage = await page.evaluate(() => {
        const errorDivChildren = document.querySelector(LOGIN_SELECTORS.ERROR)?.querySelectorAll('div');
        if(!errorDivChildren) return null;
        const errorMessage  = errorDivChildren[errorDivChildren?.length - 1].innerText;
        return Promise.resolve(errorMessage);
      })

      if(!errorMessage) return err;

      if(errorMessage.includes(LOGIN_SELECTORS.ERROR_TEXT_INVALID_CREDENTIALS) || errorMessage.includes(LOGIN_SELECTORS.ERROR_TEXT_BOT)) throw new InvalidCredentialsException('Invalid credentials');
    }
  }
};

const logout = async (page: Page): Promise<void> => {
  return await page.evaluate(async () => {
    (
      document.querySelector(LOGIN_SELECTORS.LOGOUT_BUTTON) as HTMLElement
    ).click();
  });
};

export { login, logout };
