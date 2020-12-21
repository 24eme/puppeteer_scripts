const config = require('./config/typeform.config.json');
const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

(async () => {
  puppeteerExtra.use(pluginStealth());
  const browser = await puppeteerExtra.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto(config.url);

  await page.waitForTimeout(3000);
  await page.waitForSelector('button.optanon-allow-all.accept-cookies-button');
  await page.click('button.optanon-allow-all.accept-cookies-button')
  await page.waitForSelector('#btnlogin');
  await page.type('#email', config.login);
  await page.type('#password', config.password);
  await page.click('button[type=submit]#btnlogin');

  await page.waitForTimeout(3000);

  await browser.close();
})();
