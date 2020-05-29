const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


let users_data = {};

io.on('connection', (socket) => {
    // join or create a new room

    socket.on('create or join', function (room_name, user_name) {

        var clients = io.sockets.adapter.rooms[room_name];
        if (clients) clients = clients.length;

        else clients = 0;

        if (clients <= 2) {
            socket.join(room_name);
            socket.emit('created', room_name, socket.id);
            users_data[user_name] = socket.id;
            console.log('created');

        }
        else {
            socket.emit('failed', 'Max Participants exceeded');
            console.log("max participants exceeded");
        }
    });


    //
})


// to be split into modules .... 
// functional prototyping