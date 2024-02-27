/* Copyright © 2022-2023 Seneca Project Contributors, MIT License. */

import { PlaywrightCrawler } from 'crawlee'
import { v4 as uuidv4 } from 'uuid';


type WebSpiderOptions = {
  debug?: boolean,
  url: string,
  meta: string,
  body: string,
}

function WebSpider(this: any, options: WebSpiderOptions) {
  const seneca: any = this

  seneca.fix('sys:spider,spider:web')
        .message('start:crawl', startCrawlMsg)

  async function startCrawlMsg(this: any, msg: any) {
    const seneca = this
    
    // Array to hold the data from all pages from the website
    const allData: { url: string | undefined; textContent: string | null }[] = []
    let pageSize = 0
    let numberOfPages = 0
  
    const crawler = new PlaywrightCrawler({
      async requestHandler({ request, page, enqueueLinks, log }) {

        const textContent = await page.textContent('body')
        pageSize = textContent.length
        numberOfPages++

        const url = request.loadedUrl
        log.info(`Fetched content from ${url}`)
  
        // Push the HTML content and URL into the allData array
        allData.push({ url, textContent })
  
        await enqueueLinks()
      },

    })
    
    //Crawl the given URL or the default URL for now.
    await crawler.run([options.url || 'https://senecajs.org/'])

    //Preview next feature, saving meta data separately
    // -------------------- IN PROGRESS ----------------

    for (let item of allData) {
      const meta = {
        id: uuidv4(),
        name: options.url || 'Seneca-web-spider' + uuidv4(),
        url: 'https://senecajs.org/',
        size: pageSize,
        pages: numberOfPages,
      }

      //The canon could be crawl/meta
      //Saving META
      await saveMetaData(seneca, meta, options);

      const listMeta = await seneca.entity(options.meta).list$()
      console.log(listMeta)

      //The canon could be crawl/content
      //Saving BODY
      await saveBodyData(seneca, item, options);

      const listBody = await seneca.entity(options.body).list$()
      console.log(listBody)
    }
    //----------------------- END OF IN PROGRESS ----------------
  }

  async function saveMetaData(seneca: any, meta: any, options: WebSpiderOptions) {
    await seneca
      .entity(options.meta)
      .data$(meta)
      .save$();
  }
  
  async function saveBodyData(seneca: any, item: any, options: WebSpiderOptions) {
    await seneca
      .entity(options.body)
      .data$(item)
      .save$();
  }
  
}

// Default options.
const defaults: WebSpiderOptions = {
  // TODO: Enable debug logging
  debug: false,
  meta: 'web-spider/meta',
  body: 'web-spider/body',
  url: 'https://senecajs.org/',
}

Object.assign(WebSpider, { defaults })

export default WebSpider

if ('undefined' !== typeof module) {
  module.exports = WebSpider
}
