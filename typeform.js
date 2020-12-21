const config = require('./config/typeform.config.json');
const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

(async () => {
  puppeteerExtra.use(pluginStealth());
  const browser = await puppeteerExtra.launch({ headless: false, defaultViewport: {height: 766, width: 1300} });

  const page = await browser.newPage();
  await page.goto(config.url);

  // Page de connexion
  await console.log('Page de connexion');
  await page.waitForTimeout(3000);
  await page.waitForSelector('button.optanon-allow-all.accept-cookies-button');
  await page.click('button.optanon-allow-all.accept-cookies-button')
  await page.waitForSelector('#btnlogin');
  await page.type('#email', config.login);
  await page.type('#password', config.password);
  await page.click('button[type=submit]#btnlogin');

  await console.log('On attend que la page de liste des questionnaires apparaisse');
  await page.waitForSelector('a.Link-sc-__sc-1bfji0h-0.responses-text__ButtonLink-sc-1yb3968-0.jhxRdb');

  // Page du choix de questionnaire
  await console.log('On clique sur notre questionnaire');
  await page.click('a.Link-sc-__sc-1bfji0h-0.responses-text__ButtonLink-sc-1yb3968-0.jhxRdb');

  // Chargement du questionnaire
  await console.log('On attends que les réponses chargent');
  await page.waitForSelector('div.Container-sc-__sc-14tr3x4-0.giwdMR', {visible: true});
  await page.waitForTimeout(10000);

  await console.log('On récupère les divs qui correspondent à chaque répondant');
  const answers = await page.evaluate(() => {
    let divs = window.document.querySelectorAll('[data-qa-preview-index]');
    console.log(divs.length)
    return divs;
  });
  await console.log('Nombre de répondant : '+answers.length);
  answers.forEach(function(item, index, array) { console.log(item, index) });

  await browser.close();
})();