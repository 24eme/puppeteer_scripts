const puppeteer = require('puppeteer');

let file = '/tmp/screen.jpg';

(async () => {
  const browser = await puppeteer.launch({ headless: true, defaultViewport: {height: 1080, width: 1920} });

  const page = await browser.newPage();

  await page.goto('https://google.com', {waitUntil: ["load","networkidle0"]});
  await page.screenshot({path: file, fullPage: true})
  await browser.close()

})();
