const {setWorldConstructor} = require('cucumber');

function CustomWorld() {
    this.headers = {};
    this.video = {};
}

setWorldConstructor(CustomWorld);
