const Seneca = require('seneca')
const { PlaywrightCrawler } = require('crawlee')

// async function runCrawler() {

async function WebSpider() {
  const allData = [] // Array to hold the data from all pages

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
  await crawler.run(['https://senecajs.org/'])

  // After crawling is complete, the allData array will have the content from all visited pages
  console.log(allData) // Or process the data as needed
}

async function makeSeneca() {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use(WebSpider)

  const res0 = await seneca.post('sys:spider, spider:web, start:crawl')
  console.log('res0', res0)
  return seneca.ready()
}

WebSpider().catch(console.error)
