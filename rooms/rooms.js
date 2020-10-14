window.HELP_IMPROVE_VIDEOJS = false;

const roomId = window.location.pathname.replace('/rooms/', '');
let clientId;
if (Cookies.get('id') === undefined) {
    clientId = Math.random().toString(36).substr(2);
    Cookies.set('id', clientId);
} else {
    clientId = Cookies.get('id');
}

const socket = io.connect(window.location.href.replace(window.location.pathname, ''));
socket.on('connect', async () => {
    const dialog = $('#interaction-dialog');
    dialog.modal({
        escapeClose: true,
        clickClose: true,
    });
    window.dialogShown = true;
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
            if (url.length > 0) {
                await showVideoFromURL(roomId, url);
            }
        });

        if (Cookies.get('show') === 'true') {
            Cookies.set('show', false);
            showVideoFromURL(roomId, Cookies.get(roomId + '-video'));
        }
    });
});

/*
getTrends().then(videoMetas => {
    videoMetas.forEach(videoMeta => {
        $('#inner_trend').append(`<img src="${videoMeta.thumbnailUrl}" class="boxvideo" id="trends-${videoMetas.indexOf(videoMeta)}" alt="${videoMeta.title}"/>`);
    });
    $('#inner_trend *').click(async event => {
        const videoMeta = videoMetas[parseInt(event.target.id.split('-')[1])];
        await showVideoFromURL(roomId, videoMeta.url);
        play();
    });
});
*/
