const {Then, When} = require('cucumber');
const {expect} = require('chai');

const isShown = async (page) => {
    await page.waitForSelector('#interaction-dialog');
    await page.waitForFunction('window.dialogShown === true');
    const display = await page.evaluate(() =>
        window.getComputedStyle(document.querySelector('#interaction-dialog')).display
    );
    expect(display).to.eql('inline-block');
}

const close = async (page) => {
    await page.keyboard.press("Escape");
}

const isHidden = async (page) => {
    const display = await page.evaluate(() =>
        window.getComputedStyle(document.querySelector('#interaction-dialog')).display
    );
    expect(display).to.eql('none');
}

Then(/^the initial dialog is shown$/, async function () {
    await isShown(this.page)
});
When(/^the initial dialog gets closed$/, async function () {
    await close(this.page)
});
Then(/^the initial dialog is hidden$/, async function () {
    await isHidden(this.page)
});
When(/^the initial dialog is skipped$/, async function () {
    await isShown(this.page)
    await close(this.page)
    await isHidden(this.page)
});
