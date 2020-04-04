window.HELP_IMPROVE_VIDEOJS = false;

const parseYoutubeURL = url => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
};

const socket = io.connect(window.location.href.replace(window.location.pathname, ''));
socket.on('connect', async () => {
    const dialog = $('#interaction-dialog');
    dialog.modal({
        escapeClose: true,
        clickClose: true,
    });
    dialog.on($.modal.BEFORE_CLOSE, () => {
        socket.on('state', (data) => {
            console.log('state', data);
            if (data.video != null) {
                showVideoFromMeta(data.video);
                seek(data.timestamp);
                if (data.playing) {
                    play();
                }
            }
        });
        socket.on('participants', participants => {
            console.log('participants', participants);
        });
        socket.on('video', meta => {
            showVideoFromMeta(meta);
            play();
        });
        socket.on('play', play);
        socket.on('pause', pause);
        socket.on('seek', seek);

        video.on('play', onPlay);
        video.on('pause', onPause);
        video.on('seeked', onSeek);

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

        const videoURLForm = $('#video-url-form');

        videoURLForm.submit(async event => {
            event.preventDefault();
            const url = $('#video-url-input').val();
            await showVideoFromURL(roomId, url);
            seek(0);
            play();
        });

        if (Cookies.get('show') === 'true') {
            Cookies.set('show', false);
            showVideoFromURL(roomId, Cookies.get(roomId + '-video'));
        }
    });
});

const showVideoFromURL = async (roomId, url) => {
    console.log(`roomId: ${roomId} url: ${url}`);
    const videoMeta = await videoMetaFromYoutubeVideoId(parseYoutubeURL(url));
    console.log(videoMeta);
    Cookies.set(roomId + '-video', url);
    socket.emit('video', videoMeta);
    showVideoFromMeta(videoMeta);
};

const showVideoFromMeta = data => {
    video.prop('width', data.width);
    video.prop('height', data.height);
    video.prop('poster', data.thumbnailUrl);
    video.html(`<source src="${data.url}" type="${data.mimeType}" />`);
};
