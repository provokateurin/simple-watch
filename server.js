const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const got = require('got');

server.listen(8000);

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/js-cookie', express.static(__dirname + '/node_modules/js-cookie/src/'));

app.get('/script.js', function (req, res) {
    res.sendFile(__dirname + '/index/script.js');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index/index.html');
});

app.get('/rooms/script.js', function (req, res) {
    res.sendFile(__dirname + '/rooms/script.js');
});

app.get('/rooms/youtube_extractor.js', function (req, res) {
    res.sendFile(__dirname + '/rooms/youtube_extractor.js');
});

app.get('/rooms', (req, res) => {
    res.redirect('/');
});

app.get('/rooms/*', function (req, res) {
    res.sendFile(__dirname + '/rooms/rooms.html');
});

app.get('/internal/video/:id', async (req, res) => {
    res.type('html');
    try {
        const response = await got('https://www.youtube.com/watch?v=' + req.params.id);
        res.send(response.body);
    } catch (error) {
        console.log(error.response.body);
        res.send('Failed to load Youtube');
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
                'timestamp': null,
                'playing': false,
                'participants': [clientId],
                'master': clientId,
            };
        } else {
            rooms[roomId].participants.push(clientId);
            socket.broadcast.to(roomId).emit('participants', rooms[roomId].participants);
        }
        socket.emit('state', rooms[roomId]);
    });
    socket.on('video', id => {
        rooms[roomId].video = id;
        socket.broadcast.to(roomId).emit('video', id);
    });
    socket.on('play', () => {
        rooms[roomId].playing = true;
        socket.broadcast.to(roomId).emit('play');
    });
    socket.on('pause', () => {
        rooms[roomId].playing = false;
        socket.broadcast.to(roomId).emit('pause');
    });
    socket.on('seek', data => {
        rooms[roomId].timestamp = data;
        socket.broadcast.to(roomId).emit('seek', data);
    });
    socket.on('disconnect', () => {
        if (rooms[roomId] !== undefined) {
            rooms[roomId].participants = rooms[roomId].participants.filter(id => id !== clientId);
            if (rooms[roomId].participants.length === 0) {
                // If no clients are left in the room wait 30 seconds before deleting it finally
                setTimeout(() => {
                    if (rooms[roomId].participants.length === 0) {
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
