/* Copyright © 2022-2023 Seneca Project Contributors, MIT License. */

import { PlaywrightCrawler } from 'crawlee'
import { v4 as uuidv4 } from 'uuid';


type WebSpiderOptions = {
  debug: boolean,
  canon: any,
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
  
    await crawler.run(['https://senecajs.org/'])


    //Preview next feature, saving meta data separately
    // -------------------- IN PROGRESS
    const meta = {
      id: uuidv4(),
      name: 'Seneca-web-spider',
      url: 'https://senecajs.org/',
      size: pageSize,
      pages: numberOfPages,
    }

    for (let item in meta) {
      //The caon could be crawl/meta
      await seneca.entity(options.canon).data$(meta).save$()
    }

    for (let item of allData) {
      //The caon could be crawl/content
      await seneca.entity(options.canon).data$(item).save$()
    }

    const list = await seneca.entity(options.canon).list$()

    //----------------------- END OF IN PROGRESS
    return list
    
  }

  return {
    ok: true,
    name: 'web-spider',
    data: {
      startCrawlMsg,
    },
  }

}

// Default options.
const defaults: WebSpiderOptions = {
  // TODO: Enable debug logging
  debug: false,
  canon: 'web-spider/content',
}

Object.assign(WebSpider, { defaults })

export default WebSpider

if ('undefined' !== typeof module) {
  module.exports = WebSpider
}
