$(function () { 
  // Enter a name to be used for the project
  var name = prompt('Enter a Username (Optional):');
  if (name.length == '') {
    name = `Chatter_${Math.floor(1 + Math.random()*(max + 1 - 1))}`; // Chatter_<random>
  }


  var socket = io(); // Socket IO inst.

  
  socket.on('connect', () => { // Connection Established
    $('#messages').append($('<li>').text('You\'ve entered chat'));
    window.scrollTo(0, document.body.scrollHeight); // Scroll window along with the bottom list item
    socket.emit('join', name);
    $('#messages').append($('<li>').text("Welcome to the Chatroom! Use the box below to chat."));
    $('#userList').append($('<li>').text(`${name}`));
  });

  $('form').submit(function ( event ) {
    event.preventDefault;
    console.log($('#m').val() == new RegExp('\\s+'));
    if(/^ *$/.test($('#m').val())) return false;
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
        return;
      }
    }
  });

  socket.on('updateSideMenu', function (userList) {
    userList.forEach(item => {
      $('#userList').append($('<li>').text(item));
    });
  });
});