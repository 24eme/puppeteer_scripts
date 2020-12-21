const config = require('./config/typeform.config.json');
const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

(async () => {
  puppeteerExtra.use(pluginStealth());
  const browser = await puppeteerExtra.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto(config.url);

  // Page de connexion
  await page.waitForTimeout(3000);
  await page.waitForSelector('button.optanon-allow-all.accept-cookies-button');
  await page.click('button.optanon-allow-all.accept-cookies-button')
  await page.waitForSelector('#btnlogin');
  await page.type('#email', config.login);
  await page.type('#password', config.password);
  await page.click('button[type=submit]#btnlogin');

  await page.waitForSelector('a.Link-sc-__sc-1bfji0h-0.responses-text__ButtonLink-sc-1yb3968-0.jhxRdb');

  // Page du choix de questionnaire
  await page.click('a.Link-sc-__sc-1bfji0h-0.responses-text__ButtonLink-sc-1yb3968-0.jhxRdb');
  await page.waitForTimeout(3000);

  await browser.close();
})();
