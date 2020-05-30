const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);

// 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = [];

io.on('connection', (socket) => {

    // join or create a new room

    socket.on('join', function (room_name, user_name) {

        let clients = io.sockets.adapter.rooms[room_name];
        if (clients) clients = clients.length;
        else clients = 0;

        if (clients <= 2) {
            socket.join(room_name);
            socket.emit('created', room_name, socket.id);
            //
            socket.username = user_name;
            // usernames[username] = socket.id;

            users.push({
                user: user_name,
                room: room_name,
                id: socket.id,
                option: null
            })

            console.log('created');

        }
        else {
            socket.emit('failed', 'Max Participants exceeded');
            console.log("max participants exceeded");
        }
    });


    //when a move is triggered by user

    socket.on('move', function (room_name, option) {

        let result, user1Choice, user2Choice, user;

        // updating current user's option
        user = users.find(element => element.id === socket.id);
        user.option = option;

        // checks if other user had made selection

        let other_user = users.findIndex(element => (element.room === room && element.id != socket.id));
        if (other_user) {
            user2Choice = other_user.option;
            user1Choice = users.find(element => element.id === socket.id);
            user1Choice = user1Choice.option;

            if (user1Choice === user2Choice) {
                result = 'tie';
            }

            else {
                switch (user2Choice) {
                    case 'Rock':
                        if (user1Choice === 'Paper') {
                            result = "User 2 won";
                        }

                        else {
                            result = "User 1 won";
                        }
                        break;
                    case 'Paper':
                        if (user1Choice === 'Scissors') {
                            result = "User 1 won";
                        }

                        else {
                            result = "User 2 won";

                        }
                        break;
                    case 'Scissors':
                        if (user1Choice === 'Rock') {
                            result = "User 1 won";
                        }

                        else {
                            result = "User 2 won";
                        }
                        break;
                }
            }

            io.in(room_name).emit('result', result);

        }

        else {
            socket.to(room_name).emit('status', "waiting for opponent");
        }

    });

    // on user disconnection

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        socket.broadcast.emit('userdisconnect', socket.username + 'left the game');
    })
})


// to be split into modules .... 
// functional prototyping


