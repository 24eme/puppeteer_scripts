const puppeteer = require('puppeteer');
const config = require('./config/screenshot.config.json')

if (process.argv[2] === undefined) {
  console.error('Missing argument: <Place>')
  return false
}

const place = process.argv[2]
const topPage = process.argv[3]
const file = './out/screenshot/'+place+'.jpg';

(async () => {
  const browser = await puppeteer.launch({ headless: true, defaultViewport: {height: 1080, width: 1920} });

  try {
    const page = await browser.newPage();
    await page.emulateMediaType('print')

    result = await page.goto(config.base_url + place, {waitUntil: ["load","networkidle0"]})

    if (result.status() === 404 || result.status() === 500) {
      throw ('Server responded for ' + config.base_url + place + ' : '+result.status()+' : '+result.statusText());
    }

    if (topPage) {
      await page.waitForSelector('#section-localisation')
      let screenshotHeight = await page.$('#section-localisation')
      screenshotHeight = await screenshotHeight.boundingBox()

      await page.screenshot({path: file, clip: {
        x: 0, y: 0, width: 1920, height: screenshotHeight.y
      }})
    } else {
      await page.screenshot({path: file, fullPage: true})
    }
  } catch (e) {
    console.error(e)
    await browser.close()
    process.exit(1)
  } finally {
    await browser.close()
  }
})();
