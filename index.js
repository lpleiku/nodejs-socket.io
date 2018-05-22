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

io.on('connection', function (socket) {

    socket.on('disconnect', function () {
        listUser.splice(listUser.indexOf(socket.username), 1);
        io.sockets.emit('listUser', listUser);
    });

    socket.on('username', function (username) {
        if(listUser.indexOf(username) >= 0){
            socket.emit('username_error');
        }
        else {
            listUser.push(username);
            socket.username = username;
            socket.emit('username_success');
            io.sockets.emit('listUser', listUser);
        }
    });

    socket.on('message', function (message) {
        io.sockets.emit('resMessage', {user: socket.username, mess: message});
    });
});

app.get('/', function (req, res) {
    res.render('trang-chu')
});
