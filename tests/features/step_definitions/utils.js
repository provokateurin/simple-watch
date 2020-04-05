const {Given} = require('cucumber');

Given(/^a user-agent$/, function () {
    this.headers['user-agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';
});
