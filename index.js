/*
 * Chat Application: Data Communications Dr. Wang, 12:30 MW
 * Date :12/6/19
 * Group: Michael Zacierka, Tom Lentz, Emily Flieg
 * Description: 
 * -----------------------------------------------------------------
 * |                                                               |
 * |  Simple Chat Application using sockets over a TCP connection  |
 * |                                                               |
 * -----------------------------------------------------------------
 */
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4444;
var allClients = [];
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

/*
  Connection has been established with a client
*/
io.on('connection', function (socket) {
  console.log("Connection established | " + new Date());
  socket.emit('updateSideMenu', allClients.map(m => m.username));
  socket.on('chat message', function(msg_obj) {
    io.emit('chat message', msg_obj);
  });

  /*
    Join event from client to server request, resend via that socket
  */
  socket.on('join', function(user) {
    socket.username = user;
    allClients.push(socket);
    socket.broadcast.emit('join', { msg:`${user} has joined the chat.`, username: user} );
  });
  /*
    Disconnect event from client, use server to tell all clients a user left
  */
  socket.on('disconnect', function () {
    var i = allClients.indexOf(socket);
    var user = allClients.splice(i, 1)[0];
    io.emit('leave', { msg:`${socket.username} has left the chat.`, username: user.username });
    console.log('Connection Disbanded | user - ' + user.username);
  });
});

/*
  Run the server via ports 4444
*/
http.listen(port, function () {
  console.log('listening on *:' + port);
});