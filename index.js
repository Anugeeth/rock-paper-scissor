const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
//         io.emit('chat message', msg);

//     });
// });

let users_data = {};

io.on('connection', (socket) => {
    // join or create a new room

    var clients = 0;

    socket.on('create or join', function (room_name, user_name) {

        var user = io.nsps['/'].adapter.rooms[room_name];
        if (user)
            // clients = Object.keys (user).length;
            clients = user.length

        if (clients < 2 ) {
            socket.join(room_name);
            socket.emit('created', room_name, socket.id);
            users_data[user_name] = socket.id;
            // users_data[user_name].room = room_name;
            console.log('created');

        }
        else {
            socket.emit('failed', 'Max Participants exceeded');
            console.log("max participants exceeded");
        }

        console.log(socket.adapter.nsp)

        // console.log(users_data)
        // for (let [k,v ] in Object.entries(users_data)){
        //     console.log(k,v)
        // }

    });


    //
})


// to be split into modules .... 
// functional prototyping