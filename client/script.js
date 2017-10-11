// socket init
var socket = io();

init();

var clientsData;

var xspacing = 40; // Distance between each horizontal location
var w; // Width of entire wave
var theta = 0.0; // Start angle at 0
var amplitude = 75.0; // Height of wave
var period = 500.0; // How many pixels before the wave repeats
var dx; // Value for incrementing x
var yvalues; // Using an array to store height values for the wave

function setup() {
  // createCanvas(200, 200);
  createCanvas(window.innerWidth, window.innerHeight);
  calc();
}

function draw() {
  background(0);
  calcWave();
  renderWave();
  frameRate(20);
}

function calc() {
  w = width + 16;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));
}

function calcWave() {
  // Increment theta (try different values for
  // 'angular velocity' here)
  theta += 0.06;

  // For every x value, calculate a y value with sine function
  var x = theta;
  for (var i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * amplitude;
    x += dx;
  }
}

function renderWave() {
  noStroke();
  fill(255);
  // A simple way to draw the wave with an ellipse at each location
  for (var x = 0; x < yvalues.length; x++) {
    ellipse(x * xspacing, height / 2 + yvalues[x], 16, 16);
  }
}

// P5.js
// function setup() {
//   // createCanvas(window.innerWidth, window.innerHeight);
// }
//
// function draw() {
//   // if (mouseIsPressed) {
//   //   fill(0);
//   // } else {
//   //   fill(255);
//   // }
//   // ellipse(mouseX, mouseY, 80, 80);
// }

function windowResized() {
  calc();
  resizeCanvas(windowWidth, windowHeight);
}

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
    $('#terminal').append($('<p>').html(
      "<i>" +
      msg.msg +
      "</i>"
    ));

    // sd mined
    $('#dc-capital').html(truncateDecimals (msg.capital,1));

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
