const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);

// 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const usernames = {};

io.on('connection', (socket) => {
    // join or create a new room

    socket.on('create or join', function (room_name, user_name) {

        let clients = io.sockets.adapter.rooms[room_name];
        if (clients) clients = clients.length;
        else clients = 0;

        if (clients <= 2) {
            socket.join(room_name);
            socket.emit('created', room_name, socket.id);
            socket.username = user_name;
            usernames[username] = socket.id;
            console.log('created');

        }
        else {
            socket.emit('failed', 'Max Participants exceeded');
            console.log("max participants exceeded");
        }
    });


    //when a move is triggered by user

    socket.on('move', function (room_name, option) {
        const user = users_data.find(element => element == socket.id);

        socket.broadcast.to(room_name).emit()
        
    });

    // on user disconnection

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        socket.broadcast.emit('userdisconnect', socket.username + 'left the game');
    })
})


// to be split into modules .... 
// functional prototyping