const puppeteer = require('puppeteer')

function describe (jsHandle) {
  return jsHandle.executionContext().evaluate(o => o, jsHandle)
}

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  page.on('console', async msg => {
    const args = await Promise.all(msg.args().map(arg => describe(arg)))
    console.log(args)
  })

  await page.addScriptTag({
    path: './web/bundle.js'
  })
  // await browser.close();
})()
