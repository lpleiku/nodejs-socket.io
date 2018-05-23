var express = require('express');
var app = express();

app.use(express.static('assets'));
app.set('view engine', 'ejs');
app.set('views', './views');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('App listening on port 3000')
});

var listUser = [];
var listRoom = [];

io.on('connection', function (socket) {

    socket.on('disconnect', function () {
        if(listUser.indexOf(socket.username) >= 0){
            listUser.splice(listUser.indexOf(socket.username), 1);
        }
        io.sockets.emit('listUser', listUser);

        if(!socket.adapter.rooms[socket.room]){
            if(listRoom.findIndex(function(r){return r.name === socket.room}) >= 0){
                listRoom.splice(listRoom.findIndex(function(r){return r.name === socket.room}), 1);
            }
        }
        else {
            listRoom[listRoom.findIndex(function(r){return r.name === socket.room})].number = socket.adapter.rooms[socket.room].length;
        }
        io.sockets.emit('listRoom', listRoom);
    });

    socket.on('username', function (username) {
        if(listUser.indexOf(username) >= 0){
            socket.emit('username_error');
        }
        else {
            listUser.push(username);
            socket.username = username;
            socket.emit('username_success', username);
            io.sockets.emit('listUser', listUser);
            io.sockets.emit('listRoom', listRoom);
        }
    });

    socket.on('message', function (message) {
        io.sockets.emit('resMessage', {user: socket.username, mess: message});
    });

    socket.on('create_room', function (room) {
        if(listRoom.indexOf(room) >= 0){
            socket.emit('create_room_error');
        }
        else {
            socket.join(room);
            socket.room = room;
            listRoom.push({name: room, number: socket.adapter.rooms[room].length});
            socket.emit('create_room_success', room);
            io.sockets.emit('listRoom', listRoom);
        }
    });

    socket.on('join_room', function (room) {
        socket.join(room);
        socket.room = room;
        listRoom[listRoom.findIndex(function(r){return r.name === room})].number = socket.adapter.rooms[room].length;
        io.sockets.emit('listRoom', listRoom);
    });
});

app.get('/', function (req, res) {
    res.render('trang-chu')
});
