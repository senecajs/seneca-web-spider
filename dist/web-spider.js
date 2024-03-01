/* Copyright © 2022-2023 Seneca Project Contributors, MIT License. */
import { PlaywrightCrawler } from 'crawlee';
import { v4 as uuidv4 } from 'uuid';
function WebSpider(options) {
    const seneca = this;
    seneca.fix('sys:spider,spider:web')
        .message('start:crawl', startCrawlMsg);
    async function startCrawlMsg(msg) {
        const seneca = this;
        // Array to hold the data from all pages from the website
        const allData = [];
        let pageSize = 0;
        let numberOfPages = 0;
        const crawler = new PlaywrightCrawler({
            async requestHandler({ request, page, enqueueLinks, log }) {
                const textContent = await page.textContent('body');
                const cleanedContent = cleanTextContent(textContent);
                pageSize = textContent.length;
                numberOfPages++;
                const url = request.loadedUrl;
                // log.info(`Fetched content from ${url}`)
                // Push the HTML content and URL into the allData array
                allData.push({ url, textContent: cleanedContent });
                if (options.crawlerOptions?.fullCrawl) {
                    await enqueueLinks(); // Only call this if FullCrawl is true
                }
            },
        });
        //Crawl the given URL or the default URL for now.
        await crawler.run([options.url || 'https://senecajs.org/']);
        //Preview next feature, saving meta data separately
        // -------------------- IN PROGRESS ----------------
        for (let item of allData) {
            const meta = {
                id: uuidv4(),
                name: options.url || 'Seneca-web-spider' + uuidv4(),
                url: 'https://senecajs.org/',
                size: pageSize,
                pages: numberOfPages,
            };
            //The canon could be crawl/meta
            //Saving META
            await saveMetaData(seneca, meta, options);
            const listMeta = await seneca.entity(options.canon.meta).list$();
            console.log('listMeta', listMeta);
            //The canon could be crawl/content
            //Saving BODY
            await saveBodyData(seneca, item, options);
            const listBody = await seneca.entity(options.canon.body).list$();
            console.log('listBody', listBody);
        }
        //----------------------- END OF IN PROGRESS ----------------
    }
    async function saveMetaData(seneca, meta, options) {
        await seneca
            .entity(options.canon.meta)
            .data$(meta)
            .save$();
        // await seneca.post('sys:spider,spider:web', meta)
    }
    async function saveBodyData(seneca, item, options) {
        await seneca
            .entity(options.canon.body)
            .data$(item)
            .save$();
        // await seneca.post('sys:spider,spider:web', meta)
    }
    function cleanTextContent(textContent) {
        // Replace multiple spaces, tabs, and newlines with a single space
        const cleanedContent = textContent.replace(/\s+/g, ' ').trim();
        return cleanedContent;
    }
}
// Default options.
const defaults = {
    // TODO: Enable debug logging
    debug: false,
    canon: {
        meta: 'web-spider/meta',
        body: 'web-spider/body',
    },
    url: 'https://senecajs.org/',
    crawlerOptions: {
        fullCrawl: false,
    }
};
Object.assign(WebSpider, { defaults });
export default WebSpider;
if ('undefined' !== typeof module) {
    module.exports = WebSpider;
}
//# sourceMappingURL=web-spider.js.map