export const enum LOGIN_SELECTORS {
  LOGOUT_BUTTON = '[data-test="sign-out"]',
  LOGIN_BUTTON = 'button.LockedHomeHeaderStyles__signInButton',
  USERNAME_FIELD = '[name="username"]',
  PASSWORD_FIELD = '[name="password"]',
  SUBMIT_BUTTON = 'button[name="submit"]',
  ERROR = '.textAndIconContainer .text',
  ERROR_TEXT_INVALID_CREDENTIALS = 'The username and password you specified are invalid.',
  ERROR_TEXT_BOT = `Please prove to us you're not a bot and retry with your credentials.`
}
