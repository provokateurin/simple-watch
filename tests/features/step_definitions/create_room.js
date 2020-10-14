const {Given, When, Then} = require('cucumber');
const {expect} = require('chai');

Given(/^a browser being on the main page$/, async function () {
    await this.openPage('http://localhost:8000');
});
When(/^entering a video with the URL "([^"]*)"$/, async function (URL) {
    await this.page.waitForSelector('#create-room-input');
    const element = await this.page.$('#create-room-input');
    await element.type(URL);
});
When(/^clicking on the create room button$/, async function () {
    await this.page.waitForSelector('#create-room-submit');
    await this.page.click('#create-room-submit');
    await this.page.waitForResponse(response => response.ok())
});
Then(/^the browser navigates to a new room$/, async function () {
    expect(this.page.url()).to.match(/http:\/\/localhost:8000\/rooms\/(.+)/);
});
Then(/^the room has a video with URL "([^"]*)" in the searchbar$/, async function (URL) {
    if (URL === null) {
        URL = "";
    }

    const value = await (await this.page.evaluate((sel) => {
        return document.querySelector(sel).value
    }, '#video-url-input'));
    expect(value).to.eql(URL);
});
