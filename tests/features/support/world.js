const {setWorldConstructor, setDefaultTimeout} = require('cucumber');
const puppeteer = require('puppeteer');

const HEADLESS = process.env.HEADLESS !== "false";

function CustomWorld() {
    this.headers = {};
    this.video = {};
    this.openPage = async URL => {
        this.browser = await puppeteer.launch({headless: HEADLESS});
        this.page = await this.browser.newPage();
        await this.page.goto(URL);
    };
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(30 * 1000)
