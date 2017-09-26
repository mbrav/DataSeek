//Data Seek
//created by Michael Braverman on October 14, 2016

var express = require('express');
var app = express();
var serv = require('http').Server(app);

var clientsOnline = 0;

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

// make everything in the /client folder available to the user
app.use(express.static('client'));

// socket.io connection port
serv.listen(2000);
console.log('SERVER STARTED');

var chatRecord = [];
var clientRecord = {};

// RECEIVING DATA
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	// setup the client once his settings are received
	console.log("New Client");
	clientsOnline++;
	clientRecord[socket.id] = socket;
	// update socket data when new position recieved from a player
	socket.on('clientInit', function(msg) {
		console.log("new client connected");
		console.log(msg);

		// SOCKET - sends just to current client
		// send the chat history to client
		socket.emit('clientInitResponse', {
			chatRecord:chatRecord,
			clientsOnline: clientsOnline
		});

		// store in record
		var time = new Date().getTime();
		var date = new Date(time);
		chatRecord.push({
			clientsOnline: clientsOnline,
			host: socket.handshake.headers.host,
			agent: socket.handshake.headers["user-agent"],
			time: date.toString()
		});
		console.log(chatRecord[chatRecord.length]);

		//  - sends just to current client
		// send the nmost recent messat to everyoone
		io.emit('newClientBrodcast', {
			chatRecord:chatRecord[chatRecord.length-1],
			clientsOnline: clientsOnline
		});
	});

	// disconnect player when he leaves
	socket.on('disconnect', function() {
		console.log("Client disconnect");
		clientsOnline--;

		// delete player
		delete clientRecord[socket.id];

		io.emit('clientDisconnect', {
			clientsOnline: clientsOnline
		});
	});
});

// server message
var refresh = 0.1; // set refresh rate (times per second)
setInterval(function(){

	io.emit('serverMessage', {
			msg: "Hello"
	});

}, 1000/refresh);

function opacityFormula(usersOnline) {
  return Math.exp(usersOnline/100)-1;
}
