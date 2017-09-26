// socket init
var socket = io();

init();

function init() {
  // send player settings
  socket.emit('clientInit', {
    msg: "hi"
  });

  // response from the server
  socket.on('clientInitResponse', function(msg){
    for (var i = 0; i < msg.chatRecord.length; i++) {
      logConnectedUser(msg.chatRecord[i]);
    }
  });

  socket.on('newClientBrodcast', function(msg){
    clientsOnline = msg.clientsOnline;
    updateBasedOnClientsOnline(clientsOnline);

    console.log(msg);

    logConnectedUser(msg.chatRecord);
  });

  socket.on('clientDisconnect', function(msg){
    updateBasedOnClientsOnline(clientsOnline);

    $('#terminal').append(
      $('<p>').html(
        "<span>USER DISCONNECTS</span> <br> <b>"
        + msg.clientsOnline
        + "</b> users remain online"
      ));
  });

  socket.on('serverMessage', function(msg){
    $('#terminal').append($('<p>').html(
      "<i>"
      + msg.msg
      + "</i>"
      ));
  });
}

function logConnectedUser(dataObject) {
  $('#terminal').append(
    $('<p>').html(
      "<span>USER CONNECTS</span>"
      + " <b> IP: </b>"
      + dataObject.host
      + " <b> TIME: </b>"
      + dataObject.time
      + " <b> AGENT: </b>"
      + dataObject.agent
      + "<br> <b> "
      + dataObject.clientsOnline
      + "</b> users remain online "
    )
  );
}

function updateBasedOnClientsOnline(usersOnline) {
  // $('#mail-feed').css("opacity", opacityFormula(usersOnline));
  console.log(opacityFormula(usersOnline));
}

function opacityFormula(usersOnline) {
  return Math.exp(usersOnline/60)-1;
}
