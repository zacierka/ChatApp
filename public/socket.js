$(function () {
  var name = prompt('Enter a Username (Optional):');
  if (name.length == '') {
    name = `Chatter_${Math.random(4).toString(6).replace('0.', '')}`; //User<random>
  }


  var socket = io();

  
  socket.on('connect', () => {
    $('#messages').append($('<li>').text('You\'ve entered chat'));
    window.scrollTo(0, document.body.scrollHeight);
    socket.emit('join', name);
    $('#messages').append($('<li>').text("Welcome to the Chatroom! Use the box below to chat."));
    $('#userList').append($('<li>').text(`${name}`));
  });

  $('form').submit(function () {
    socket.emit('chat message', {
      name: name,
      msg: $('#m').val().substring(0, 279)
    });
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(`${msg.name}: ${msg.msg.substring(0, 279)}`));
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on('join', function (msg) {
    $('#messages').append($('<li>').text(msg.msg));
    window.scrollTo(0, document.body.scrollHeight);
    $('#userList').append($('<li>').text(`${msg.username}`));
  });

  socket.on('leave', function (msg) {
    $('#messages').append($('<li>').text(msg.msg));
    window.scrollTo(0, document.body.scrollHeight);
    var user = msg.username;
    var list = $('#userList li');
    for(var i = 0; i <= list.length; i++) {
      console.log(list[i].outerText);
      if(list[i].outerText === user) {
        //remove item document.querySelectorAll('#userList li')[0].hidden = true
        list[i].hidden = true;
      }
    }
  });

  socket.on('updateSideMenu', function (userList) {
    userList.forEach(item => {
      $('#userList').append($('<li>').text(item));
    });
  });
});