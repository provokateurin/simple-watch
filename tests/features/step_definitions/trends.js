const {When, Then} = require('cucumber');
const {expect} = require('chai');
const got = require('got');

let trends = [];

When(/^fetching the trends$/, async function () {
    trends = JSON.parse((await got('http://localhost:8000/internal/trends', {
        'headers': this.headers,
    })).body);
});
Then(/^it returns (\d+) videos$/, numberOfVideos => {
    expect(trends.length).to.eql(numberOfVideos);
});
Then(/^every video has an URL$/, function () {
    trends.forEach(video => {
        expect(video.url).to.not.be.undefined;
        expect(video.url).to.not.eql(null);
        expect(typeof video.url).to.eql('string');
        expect(video.url.length).to.be.above(0);
    });
});
Then(/^every video has a thumbnail URL$/, function () {
    trends.forEach(video => {
        expect(video.thumbnailUrl).to.not.be.undefined;
        expect(video.thumbnailUrl).to.not.eql(null);
        expect(typeof video.thumbnailUrl).to.eql('string');
        expect(video.thumbnailUrl.length).to.be.above(0);
    });
});
Then(/^every video has a title$/, function () {
    trends.forEach(video => {
        expect(video.title).to.not.be.undefined;
        expect(video.title).to.not.eql(null);
        expect(typeof video.title).to.eql('string');
        expect(video.title.length).to.be.above(0);
    });
});
Then(/^the trending videos are shown$/, async function () {
    await this.page.waitForFunction('window.trendsLoaded === true');
    const childNodes = await (await this.page.evaluate(() => {
        return document.querySelectorAll('#trends *')
    }));
    expect(Object.keys(childNodes).length).to.eql(50)
});
When(/^clicking on ([0-9]{1,2}). trending video$/, async function (childIndex) {
    await this.page.evaluate((childIndex) => {
        return document.querySelectorAll(`.boxvideo`)[childIndex].click()
    }, childIndex);
});
