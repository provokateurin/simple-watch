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
