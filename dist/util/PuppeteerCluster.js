"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cluster = exports.init = void 0;
const puppeteer_cluster_1 = require("puppeteer-cluster");
// we are limiting concurrency here
let cluster;
exports.cluster = cluster;
const init = async () => {
    const args = [
        '--no-first-run',
        '--no-zygote',
        '--no-sandbox',
        '--disable-extensions',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--ignore-certificate-errors',
        "--proxy-server='direct://'",
        '--proxy-bypass-list=*',
        '--lang=en-US,en'
    ];
    const concurrency = puppeteer_cluster_1.Cluster.CONCURRENCY_BROWSER;
    exports.cluster = cluster = await puppeteer_cluster_1.Cluster.launch({
        concurrency: concurrency,
        maxConcurrency: 2,
        timeout: 120000,
        puppeteerOptions: {
            headless: true,
            dumpio: false,
            handleSIGTERM: true,
            handleSIGINT: true,
            args: args
        },
    });
};
exports.init = init;
//# sourceMappingURL=PuppeteerCluster.js.map