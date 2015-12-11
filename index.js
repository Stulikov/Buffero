var PORT = process.env.PORT || 8888;
var DEBUG = true;

var express = require('express');
var buffer = require('./buffer');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb');

var db = new Datastore({ filename: __dirname + '/log.db', autoload: true });

app.get('/hw', function (req, res) {
	res.send('Hello World!');
});

http.listen(PORT, function () {
	var host = this.address().address;
	var port = this.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/public'));







io.on('connection', function (socket) {
	var IP = socket.request.connection.remoteAddress;
	socket.on('push', function (data) {
		var timejs = (new Date);
		var timestamp = timejs.getTime();
		message_to_write = {
			"ip": IP,
			"timestamp": timestamp,
			"line": escape(data.line),
			"s_s": true
		};
		db.insert(message_to_write, function (err, newMsg) {});
		socket.emit('pushed');
		socket.broadcast.emit('fresh');
	});
	socket.on('read', function () {
		console.log("read request");
		db.find({ s_s: true, ip: IP }, { timestamp: 1, line: 1, s_s: 1 }).sort({timestamp: -1}).exec(function (err, lines) {
			socket.emit('lines', {'lines_list': lines});
		});
	});
});