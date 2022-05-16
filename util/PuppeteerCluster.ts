import { Cluster } from "puppeteer-cluster";

class PuppeteerCluster {
    static cluster: Cluster;

    static setCluster(cluster : Cluster) {
        if(!this.cluster) this.cluster = cluster;
    }

    static getCluster() {
        return this.cluster;
    }
}

export default PuppeteerCluster;