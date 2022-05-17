import { Cluster } from 'puppeteer-cluster';

// we are limiting concurrency here
let cluster: Cluster;
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
    '--lang=en-US,en'];

  const concurrency = Cluster.CONCURRENCY_BROWSER;
  cluster = await Cluster.launch({
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

export { init, cluster };
