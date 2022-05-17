import { Cluster } from "puppeteer-cluster";

let cluster : Cluster;
const init = async () => {
    const concurrency = Cluster.CONCURRENCY_BROWSER;
    cluster = await Cluster.launch({
        concurrency: concurrency,
        maxConcurrency: 3,
        timeout: 120000,
        puppeteerOptions: {
            headless : true,
            dumpio: false,
            handleSIGTERM: true,
            handleSIGINT: true
        }
    });
}

export { init, cluster };