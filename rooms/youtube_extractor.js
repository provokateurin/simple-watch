const videoMetaFromYoutubeVideoId = async id => {
    const url = window.location.href.replace(window.location.pathname, '') + '/internal/video/' + id;

    const response = await fetch(url);
    const text = await response.text();

    //determine if the video is valid
    const isValid = text.split('ytplayer.config = ')[1];
    if (!isValid) {
        return {'error': 'Invalid video id'};
    }

    //TODO - better check if valid video id

    //strip down to just json
    const fullJSON = isValid.split(';ytplayer.load')[0];
    const obj = JSON.parse(fullJSON);

    const videoInfo = obj['args']['player_response'];
    const clean = videoInfo.replace('\u0026', '&');
    const data = JSON.parse(clean);

    //sort by highest resolution
    const formats = data.streamingData.formats.sort((a, b) => (a.width > b.width ? -1 : 1));
    const format = formats[0];
    return {
        'url': format.url,
        'width': format.width,
        'height': format.height,
        'mimeType': format.mimeType,
    };
};
