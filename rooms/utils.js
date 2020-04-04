const video = $('#video');
let selfTrigger = 0;

const play = () => {
    console.log('play');
    selfTrigger++;
    video.trigger('play');
};

const pause = () => {
    console.log('pause');
    selfTrigger++;
    video.trigger('pause');
};

const seek = timestamp => {
    console.log('seek', timestamp);
    selfTrigger++;
    video.prop('currentTime', timestamp);
};

const onPlay = () => {
    if (selfTrigger === 0) {
        console.log('onPlay');
        socket.emit('play');
    } else {
        selfTrigger--;
    }
};

const onPause = () => {
    if (selfTrigger === 0) {
        console.log('onPause');
        socket.emit('pause');
    } else {
        selfTrigger--;
    }
};

const onSeek = () => {
    if (selfTrigger === 0) {
        console.log('onSeek');
        socket.emit('seek', video.prop('currentTime'));
    } else {
        selfTrigger--;
    }
};