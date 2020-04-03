alert('');

window.HELP_IMPROVE_VIDEOJS = false;

const parseYoutubeURL = url => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
};

const video = $('#video');
let selfTrigger = 0;

const socket = io.connect(window.location.href.replace(window.location.pathname, ''));
socket.on('connect', async () => {
    socket.on('state', (data) => {
        console.log('state', data);
    });
    socket.on('participants', (data) => {
        console.log('participants', data);
    });
    socket.on('video', (data) => {
        console.log('video', data);
        showVideoFromMeta(data);
    });
    socket.on('play', () => {
        console.log('play');
        selfTrigger++;
        video.trigger('play');
    });
    socket.on('pause', () => {
        console.log('pause');
        selfTrigger++;
        video.trigger('pause');
    });
    socket.on('seek', (data) => {
        console.log('seek', data);
        selfTrigger++;
        video.prop('currentTime', data);
    });
    const roomId = window.location.pathname.replace('/rooms/', '');
    let clientId;
    if (Cookies.get('id') === undefined) {
        clientId = Math.random().toString(36).substr(2);
        Cookies.set('id', clientId);
    } else {
        clientId = Cookies.get('id');
    }
    socket.emit('init', {
        'room': roomId,
        'client': clientId,
    });

    if (Cookies.get(roomId + '-video') !== undefined) {
        $('#video-url-input').val(Cookies.get(roomId + '-video'));
    }

    $('#video-url-form').submit(async event => {
        event.preventDefault();
        const url = $('#video-url-input').val();
        await showVideoFromURL(roomId, url);
    });

    video.on('play', () => {
        if (selfTrigger === 0) {
            socket.emit('play');
        } else {
            selfTrigger--;
        }
    });
    video.on('pause', () => {
        if (selfTrigger === 0) {
            socket.emit('pause');
        } else {
            selfTrigger--;
        }
    });
    video.on('seeked', () => {
        if (selfTrigger === 0) {
            socket.emit('seek', video.prop('currentTime'));
        } else {
            selfTrigger--;
        }
    });
    const play = Cookies.get('play');
    if (play) {
        $('#video-url-form').submit();
        Cookies.set('play', false);
    }
});

const showVideoFromURL = async (roomId, url) => {
    console.log(`roomId: ${roomId} url: ${url}`);
    const videoMeta = await videoMetaFromYoutubeVideoId(parseYoutubeURL(url));
    console.log(videoMeta);
    Cookies.set(roomId + '-video', url);
    socket.emit('pause');
    socket.emit('video', videoMeta);
    socket.emit('play');
    showVideoFromMeta(videoMeta);
};

const showVideoFromMeta = data => {
    video.prop('width', data.width);
    video.prop('height', data.height);
    video.html(`<source src="${data.url}" type="${data.mimeType}" />`);
    selfTrigger++;
    video.trigger('play');
};
