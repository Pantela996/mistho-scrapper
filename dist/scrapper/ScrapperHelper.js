"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScrapperHelper {
    async getChildrenElements(element) {
        return await element.$$(':scope > *');
    }
    async getInnerTextElements(rootElement, childElement) {
        return await rootElement.$$eval(childElement, element => element.map(el => el.innerText));
    }
}
exports.default = new ScrapperHelper();
//# sourceMappingURL=ScrapperHelper.js.map