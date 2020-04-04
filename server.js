const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const got = require('got');

server.listen(8000);

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/js-cookie', express.static(__dirname + '/node_modules/js-cookie/src/'));
app.use('/jquery-modal', express.static(__dirname + '/node_modules/jquery-modal/'));

app.use('/images', express.static(__dirname + '/images'));

app.get('/index.css', function (req, res) {
    res.sendFile(__dirname + '/index/index.css');
});

app.get('/index.js', function (req, res) {
    res.sendFile(__dirname + '/index/index.js');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index/index.html');
});

app.get('/rooms/rooms.css', function (req, res) {
    res.sendFile(__dirname + '/rooms/rooms.css');
});

app.get('/rooms/rooms.js', function (req, res) {
    res.sendFile(__dirname + '/rooms/rooms.js');
});

app.get('/rooms/utils.js', function (req, res) {
    res.sendFile(__dirname + '/rooms/utils.js');
});

app.get('/rooms/youtube_extractor.js', function (req, res) {
    res.sendFile(__dirname + '/rooms/youtube_extractor.js');
});

app.get('/rooms/*', function (req, res) {
    res.sendFile(__dirname + '/rooms/rooms.html');
});

app.get('/rooms', (req, res) => {
    res.redirect('/');
});

app.get('/internal/video/:id', async (req, res) => {
    try {
        const response = await got('https://www.youtube.com/watch?v=' + req.params.id);
        const text = await response.body;

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
        res.json({
            'url': format.url,
            'width': format.width,
            'height': format.height,
            'mimeType': format.mimeType,
            'thumbnailUrl': `https://i3.ytimg.com/vi/${req.params.id}/maxresdefault.jpg`,
        });
    } catch (error) {
        console.log(error);
        res.json({'error': 'Failed to load Youtube'});
    }
})

const rooms = {};

io.on('connection', (socket) => {
    let roomId;
    let clientId;

    socket.on('init', (data) => {
        roomId = data['room'];
        clientId = data['client'];
        socket.join(roomId);
        if (rooms[roomId] === undefined) {
            rooms[roomId] = {
                'video': null,
                'timestamp': 0,
                'playing': false,
                'participants': [clientId],
                'master': clientId,
                'last_update': Date.now(),
            };
        } else {
            rooms[roomId].participants.push(clientId);
            rooms[roomId].last_update = Date.now();
            socket.broadcast.to(roomId).emit('participants', rooms[roomId].participants);
        }
        if (rooms[roomId].playing) {
            const now = Date.now() / 1000;
            rooms[roomId].timestamp += now - rooms[roomId].last_update;
            rooms[roomId].last_update = now;
        }
        socket.emit('state', rooms[roomId]);
    });
    socket.on('video', id => {
        rooms[roomId].video = id;
        rooms[roomId].timestamp = 0;
        rooms[roomId].last_update = Date.now();
        socket.broadcast.to(roomId).emit('video', id);
    });
    socket.on('play', () => {
        rooms[roomId].playing = true;
        rooms[roomId].last_update = Date.now();
        socket.broadcast.to(roomId).emit('play');
    });
    socket.on('pause', () => {
        rooms[roomId].playing = false;
        const now = Date.now() / 1000;
        rooms[roomId].timestamp += now - rooms[roomId].last_update;
        rooms[roomId].last_update = now;
        socket.broadcast.to(roomId).emit('pause');
    });
    socket.on('seek', data => {
        rooms[roomId].timestamp = data;
        rooms[roomId].last_update = Date.now();
        socket.broadcast.to(roomId).emit('seek', data);
    });
    socket.on('disconnect', () => {
        if (rooms[roomId] !== undefined) {
            rooms[roomId].participants = rooms[roomId].participants.filter(id => id !== clientId);
            if (rooms[roomId].participants.length === 0) {
                // If no clients are left in the room wait 30 seconds before deleting it finally
                setTimeout(() => {
                    if (rooms[roomId] !== undefined && rooms[roomId].participants.length === 0) {
                        rooms[roomId] = undefined;
                        delete rooms[roomId];
                    }
                }, 30 * 1000);
            } else {
                // Wait 5 seconds for the client to reconnect otherwise broadcast leave message
                setTimeout(() => {
                    if (rooms[roomId].participants.filter(id => id === clientId).length === 0) {
                        socket.broadcast.to(roomId).emit('participants', rooms[roomId].participants);
                    }
                }, 5 * 1000);
            }
        }
    });
});


console.log('Listening on *:8000');
