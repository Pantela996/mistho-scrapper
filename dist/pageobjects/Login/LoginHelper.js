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
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
    }
    catch (err) {
        console.log(err.name);
        if (err.name === 'TimeoutError') {
            // pull error message if exists
            const errorMessage = await page.evaluate(() => {
                var _a;
                const errorDivChildren = (_a = document.querySelector(".textAndIconContainer .text" /* ERROR */)) === null || _a === void 0 ? void 0 : _a.querySelectorAll('div');
                if (!errorDivChildren)
                    return null;
                const errorMessage = errorDivChildren[(errorDivChildren === null || errorDivChildren === void 0 ? void 0 : errorDivChildren.length) - 1].innerText;
                return Promise.resolve(errorMessage);
            });
            if (!errorMessage)
                return err;
            if (errorMessage.includes("The username and password you specified are invalid." /* ERROR_TEXT_INVALID_CREDENTIALS */) || errorMessage.includes("Please prove to us you're not a bot and retry with your credentials." /* ERROR_TEXT_BOT */))
                throw new InvalidCredentialsException_1.default('Invalid credentials');
        }
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