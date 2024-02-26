/* Copyright © 2022-2023 Seneca Project Contributors, MIT License. */
import { PlaywrightCrawler } from 'crawlee';
function WebSpider(options) {
    const seneca = this;
    seneca.fix('sys:spider,spider:web').message('start:crawl', startCrawlMsg);
    async function startCrawlMsg(msg) {
        const seneca = this;
        // Array to hold the data from all pages from the website
        const allData = [];
        const crawler = new PlaywrightCrawler({
            async requestHandler({ request, page, enqueueLinks, log }) {
                const textContent = await page.textContent('body');
                const url = request.loadedUrl;
                log.info(`Fetched content from ${url}`);
                // Push the HTML content and URL into the allData array
                allData.push({ url, textContent });
                await enqueueLinks();
            },
        });
        await crawler.run(['https://senecajs.org/']);
        for (let item of allData) {
            await seneca.entity(options.canon).data$(item).save$();
        }
        const list = await seneca.entity(options.canon).list$();
        return list;
    }
    return {
        ok: true,
        name: 'web-spider',
        data: {
            startCrawlMsg,
        },
    };
}
// Default options.
const defaults = {
    // TODO: Enable debug logging
    debug: false,
    canon: 'web-spider/content',
};
Object.assign(WebSpider, { defaults });
export default WebSpider;
if ('undefined' !== typeof module) {
    module.exports = WebSpider;
}
//# sourceMappingURL=web-spider.js.map