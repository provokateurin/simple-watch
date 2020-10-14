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

const parseYoutubeURL = url => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
};

const showVideoFromURL = async (roomId, url) => {
    const id = parseYoutubeURL(url);
    if (id) {
        const response = await fetch(`/internal/video/${id}`);
        const videoMeta = await response.json();
        if (typeof (videoMeta.error) !== undefined) {
            Cookies.set(roomId + '-video', url);
            socket.emit('video', videoMeta);
            showVideoFromMeta(videoMeta);
        } else {
            console.error(videoMeta.error);
        }
    } else {
        throw 'Failed to parse Youtube URL';
    }
};

const showVideoFromMeta = data => {
    video.prop('poster', data.thumbnailUrl);
    video.html(`<source src="${data.url}" type="${data.mimeType}" />`);
};

const getTrends = async () => {
    const response = await fetch(`/internal/trends`);
    return await response.json();
};
