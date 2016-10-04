var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

app.use(express.static('public'));

// Connected


io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s Sockets connected', connections.length);


    // Disconnect

    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s Sockets connected', connections.length);
    });

    // Send Messages
    socket.on('send-message', function(data) {
        io.sockets.emit('new-message', {
            msg: data.message,
            name: data.name
        });
    });

    // New User
    socket.on('new-user', function(data, callback) {
        callback(true, data);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get-users', users);
    }
});

server.listen(process.env.PORT || 3000);
console.log('Server running');
