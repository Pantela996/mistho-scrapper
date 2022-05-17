"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goToUrl = void 0;
const goToUrl = async (page, url) => {
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
    });
};
exports.goToUrl = goToUrl;
//# sourceMappingURL=PuppeteerManager.js.map