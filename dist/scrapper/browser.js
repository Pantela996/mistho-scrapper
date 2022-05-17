"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const ProfilePage_1 = __importStar(require("../pageobjects/Profile/ProfilePage"));
const ProfilePageHelper_1 = require("../pageobjects/Profile/ProfilePageHelper");
const UserProfile_1 = require("../models/UserProfile");
const LoginHelper_1 = require("../pageobjects/Login/LoginHelper");
const ResponseModel_1 = __importDefault(require("../models/ResponseModel"));
class Browser {
    async crawl(url, body) {
        try {
            console.log('### Crawl started ###');
            // we use --start-maximized to standardize viewport to max resolution, so the execution is always idempotent
            const browser = await puppeteer_1.default.launch({
                headless: false,
                args: ['--start-maximized'],
                defaultViewport: null,
                dumpio: true
            });
            const generatedUuid = (0, uuid_1.v4)();
            const page = await browser.newPage();
            await page['_client'].send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: path_1.default.resolve(__dirname, `../tmp/${generatedUuid}`) });
            await page.goto(url, {
                waitUntil: 'domcontentloaded',
            });
            await (0, LoginHelper_1.login)(page, body);
            const profileContainer = await page.waitForSelector('[data-test="profile-container"]');
            //sometimes it needs a bit more to load
            await page.waitForTimeout(1000);
            await profileContainer.evaluate((b) => b.click());
            // HOME PAGE //
            // PROFILE PAGE //
            await page.waitForSelector(ProfilePage_1.PROFILE_SELECTORS.DOWNLOAD_BUTTON);
            const downloadButton = await ProfilePage_1.default.getDownloadButton(page);
            await downloadButton.evaluate((b) => b.click());
            await page.waitForSelector(ProfilePage_1.PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION);
            const userProfileData = await (0, ProfilePageHelper_1.getData)(page, generatedUuid);
            const isPresent = await UserProfile_1.UserProfile.exists({ email: userProfileData.email });
            if (!isPresent)
                await UserProfile_1.UserProfile.create(userProfileData);
            else
                await UserProfile_1.UserProfile.replaceOne({ email: userProfileData.email }, userProfileData);
            await (0, LoginHelper_1.logout)(page);
            // await page.close();
            // await browser.close();
            return ResponseModel_1.default.Success(userProfileData);
        }
        catch (err) {
            return ResponseModel_1.default.Failed({
                message: err.message,
                messageCode: "FAILED"
            });
        }
    }
}
exports.default = new Browser();
//# sourceMappingURL=browser.js.map