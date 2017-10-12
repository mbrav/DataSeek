//Data Seek
//created by Michael Braverman on October 14, 2016

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/bourgeois',function(req, res) {
	res.sendFile(__dirname + '/client/bourgeois.html');
});

// make everything in the /client folder available to the user
app.use(express.static('client'));

// socket.io connection port
serv.listen(2000);
console.log('SERVER STARTED');

// GENERAL SOCKET AND BACKEND STUFF
var socketList = {};
var clientsOnline = 0;
var chatRecord = [];

// GAME VARIABLES

// capital of players who left
var deadCapital = 0, aliveCapital = 0, capital = 0;

// RECEIVING DATA
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	// setup the client once his settings are received
	console.log("New Client");
	clientsOnline++;

	socket.dcMined = 0.0;
	socketList[socket.id] = socket;
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

		// add the player's Capital to dead Capital
		deadCapital += socketList[socket.id].dcMined;

		// delete player
		delete socketList[socket.id];

		io.emit('clientDisconnect', {
			clientsOnline: clientsOnline
		});
	});
});

// server message
var refresh = 10; // set refresh rate (times per second)
setInterval(function(){
	var d = new Date();
	var n = d.getMilliseconds();

	aliveCapital = 0;

	for (var i in socketList) {
		// some data manipulation
		var old = socketList[i].dcMined;
		socketList[i].dcMined = old * 1.0+(Math.cos(n/10)+1)/40;

		aliveCapital += socketList[i].dcMined;

		// send private message to client
		var socket = socketList[i];
		socket.emit('serverPackage', {
			dcMined : socketList[i].dcMined
		});
	}

	// add alive capital and dead capital
	capital = aliveCapital + deadCapital;

	// send public message to all clients
	io.emit('serverMessage', {
			msg: "Hello Data Miners!",
			clientsOnline: clientsOnline,
			aliveCapital: aliveCapital,
			deadCapital: deadCapital,
			capital: capital
	});

}, 1000/refresh);

function opacityFormula(usersOnline) {
  return Math.exp(usersOnline/100)-1;
}
