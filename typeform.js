const config = require('./config/typeform.config.json');
const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

let date = Date.now();
let file = './out/typeform.'+date+'.json';

(async () => {
  puppeteerExtra.use(pluginStealth());
  const browser = await puppeteerExtra.launch({ headless: true, defaultViewport: {height: 766, width: 1300} });

  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on('request', request => {
    if (request.url().startsWith(config.url)) {
      var data = {
        url: request.url()+'&page_size=1000'
      }
      request.continue(data)
    } else request.continue()
  })

  await page.goto(config.start_url, {waitUntil: 'networkidle0'});

  // Page de connexion
  await console.log('Page de connexion');
  await page.waitForTimeout(3000);
  await page.waitForSelector('button#onetrust-accept-btn-handler');
  await page.click('button#onetrust-accept-btn-handler')
  await page.waitForSelector('input[type="submit"]');
  await page.type('input[name="username"]', config.login);
  await page.type('input[name="password"]', config.password);
  await page.click('input[type="submit"]');

  await console.log('On attend que la page de liste des questionnaires apparaisse');
  await page.waitForSelector('a.Link-sc-__sc-2xj0ye-0.responses-text__ButtonLink-sc-1yb3968-0.jaRkCo');

  // Page du choix de questionnaire
  await console.log('On clique sur notre questionnaire');
  await page.click('a.Link-sc-__sc-2xj0ye-0.responses-text__ButtonLink-sc-1yb3968-0.jaRkCo');

  // Chargement du questionnaire
  await console.log('On attends que les réponses chargent');

  page.on('response', response => {
    if (response.url().startsWith(config.url) && response.request().method() == 'GET' && response.ok()) {
      console.log('On a la réponse de l\'api');
      response.json().then(r => {
        console.log('Écriture dans '+file);
        fs.writeFileSync(file, JSON.stringify(r));
        console.log('Fait !');
      })
    }
  });

  await page.waitForTimeout(60000);
  await browser.close();
})();
