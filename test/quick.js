const Seneca = require('seneca')

const { PlaywrightCrawler, Dataset } = require('crawlee')

// async function runCrawler() {

async function WebSpider() {
  const allData = [] // Array to hold the data from all pages

  const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, enqueueLinks, log }) {
      // Use page.content() to get the entire HTML content of the page
      const textContent = await page.textContent('body')
      const url = request.loadedUrl
      log.info(`Fetched content from ${url}`)

      // Push the HTML content and URL into the allData array
      allData.push({ url, textContent })

      await enqueueLinks()
    },
    // Add any other necessary configuration for the crawler
  })

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
