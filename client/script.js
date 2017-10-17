// socket init
var socket = io();

init();

// Other
function init() {
  // send player settings
  socket.emit('clientInit', {
    msg: "hi"
  });

  // response from the server
  socket.on('clientInitResponse', function(msg) {
    clientsData = msg.clientRecord;
    for (var i = 0; i < msg.chatRecord.length; i++) {
      logConnectedUser(msg.chatRecord[i]);
    }
  });

  socket.on('newClientBrodcast', function(msg) {
    clientsData = msg.clientRecord;
    clientsOnline = msg.clientsOnline;
    updateBasedOnClientsOnline(clientsOnline);

    // console.log(msg);

    logConnectedUser(msg.chatRecord);
  });

  socket.on('clientDisconnect', function(msg) {
    updateBasedOnClientsOnline(clientsOnline);

    $('#terminal').append(
      $('<p>').html(
        "<span>USER DISCONNECTS</span> <br> <b>" +
        msg.clientsOnline +
        "</b> users remain online"
      ));
  });

  // Private Server Message
  socket.on('serverPackage', function(msg) {

    // sd mined
    $('#dc-mined').html(truncateDecimals (msg.dcMined,3));

  });

  // Public Server Message
  socket.on('serverMessage', function(msg) {
    // message test
    // $('#terminal').append($('<p>').html(
    //   "<i>" +
    //   msg.msg +
    //   "</i>"
    // ));

    // sd mined
    $('#dc-capital').html(truncateDecimals (msg.capital,1));

    $('#dc-capital-alive').html(truncateDecimals (msg.aliveCapital,1));

    $('#dc-capital-dead').html(truncateDecimals (msg.deadCapital,1));

    // sd client online
    $('#client-count').html(msg.clientsOnline);
  });
}

function logConnectedUser(dataObject) {
  $('#terminal').append(
    $('<p>').html(
      "<span>USER CONNECTS</span>" +
      " <b> IP: </b>" +
      dataObject.host +
      " <b> TIME: </b>" +
      dataObject.time +
      " <b> AGENT: </b>" +
      dataObject.agent +
      "<br> <b> " +
      dataObject.clientsOnline +
      "</b> users remain online "
    )
  );
}

function updateBasedOnClientsOnline(usersOnline) {
  // $('#mail-feed').css("opacity", opacityFormula(usersOnline));
  // console.log(opacityFormula(usersOnline));
}

function opacityFormula(usersOnline) {
  return Math.exp(usersOnline / 60) - 1;
}

function truncateDecimals(number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};
