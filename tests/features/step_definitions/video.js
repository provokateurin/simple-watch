const {When, Then} = require('cucumber');
const {expect} = require('chai');
const got = require('got');

When(/^fetching a video with the id (.*)$/, async function (id) {
    this.video = JSON.parse((await got(`http://localhost:8000/internal/video/${id}`)).body)
});
Then(/^the video has an URL$/, function () {
    expect(this.video.url).to.not.be.undefined;
    expect(this.video.url).to.not.eql(null);
    expect(typeof this.video.url).to.eql('string');
    expect(this.video.url.length).to.be.above(0);
});
Then(/^the title is (.*)$/, function (title) {
    expect(this.video.title).to.eql(title);
});
Then(/^the video has an thumbnail URL which is "https:\/\/i3\.ytimg\.com\/vi\/(.*)\/maxresdefault\.jpg"$/, function (id) {
    expect(this.video.thumbnailUrl).to.not.be.undefined;
    expect(this.video.thumbnailUrl).to.not.eql(null);
    expect(typeof this.video.thumbnailUrl).to.eql('string');
    expect(this.video.thumbnailUrl.length).to.be.above(0);
    expect(this.video.thumbnailUrl).to.eql(`https://i3.ytimg.com/vi/${id}/maxresdefault.jpg`);
});
