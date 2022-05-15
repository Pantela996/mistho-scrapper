import { ElementHandle } from "puppeteer";

class ScrapperHelper {
    async getChildrenElements(element: ElementHandle<Element>): Promise<ElementHandle<Element>[]> {
        return await element.$$(':scope > *');
    }

    async getInnerTextElements(rootElement: ElementHandle<Element>, childElement: string): Promise<any[]> {
        return await rootElement.$$eval(childElement, element => element.map(el => (el as any).innerText));
    }
}

export default new ScrapperHelper();