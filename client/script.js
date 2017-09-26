// socket init
var socket = io();

init();

var clientsData;

// P5.js
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);

}
// Other

function init() {
  // send player settings
  socket.emit('clientInit', {
    msg: "hi"
  });

  // response from the server
  socket.on('clientInitResponse', function(msg){
    clientsData = msg.clientRecord;
    for (var i = 0; i < msg.chatRecord.length; i++) {
      logConnectedUser(msg.chatRecord[i]);
    }
  });

  socket.on('newClientBrodcast', function(msg){
    clientsData = msg.clientRecord;
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

      console.log(clientsData);
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
