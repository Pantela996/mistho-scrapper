"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const InvalidCredentialsException_1 = __importDefault(require("../../exceptions/InvalidCredentialsException"));
const login = async (page, body) => {
    try {
        await page.waitForSelector("button.LockedHomeHeaderStyles__signInButton" /* LOGIN_BUTTON */);
        await page.waitForTimeout(2000);
        await page.evaluate(() => {
            document.querySelector("button.LockedHomeHeaderStyles__signInButton" /* LOGIN_BUTTON */).click();
        });
        // for this type of input, evaluate will not work
        const username = await page.waitForSelector("[name=\"username\"]" /* USERNAME_FIELD */);
        await (username === null || username === void 0 ? void 0 : username.focus());
        await page.keyboard.type(body.username, {
            delay: 1,
        });
        const password = await page.waitForSelector("[name=\"password\"]" /* PASSWORD_FIELD */);
        await password.focus();
        await page.keyboard.type(body.password, {
            delay: 1,
        });
        await page.evaluate(() => {
            document.querySelector("button[name=\"submit\"]" /* SUBMIT_BUTTON */).click();
        });
        // 10 seconds to be sure that enough time elapsed, if its error. If its not error we are not waiting for it
        await page.waitForNavigation({
            timeout: 10000,
        });
    }
    catch (err) {
        if (err.name === 'TimeoutError')
            throw new InvalidCredentialsException_1.default('Invalid credentials');
        console.log(err);
    }
};
exports.login = login;
const logout = async (page) => {
    return await page.evaluate(async () => {
        document.querySelector("[data-test=\"sign-out\"]" /* LOGOUT_BUTTON */).click();
    });
};
exports.logout = logout;
//# sourceMappingURL=LoginHelper.js.map