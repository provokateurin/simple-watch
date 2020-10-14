const createRoom = url => {
    const roomId = Math.random().toString(36).substr(2);
    if (url.length > 0) {
        Cookies.set(roomId + '-video', url);
        Cookies.set('show', true);
    }
    window.location.href = `/rooms/${roomId}`;
}

$('#create-room-form').submit(event => {
    event.preventDefault();
    const url = $('#create-room-input').val();
    createRoom(url)
});

getTrends().then(videoMetas => {
    videoMetas.forEach(videoMeta => {
        $('#trends').append(`<img src="${videoMeta.thumbnailUrl}" class="boxvideo" id="trends-${videoMetas.indexOf(videoMeta)}" alt="${videoMeta.title}"/>`);
    });
    $('#trends *').click(async event => {
        const videoMeta = videoMetas[parseInt(event.target.id.split('-')[1])];
        createRoom(videoMeta.url);
    });
    window.trendsLoaded = true;
});
