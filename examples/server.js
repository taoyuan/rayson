"use strict";

var jmqtt = require('../'/*'rayson'*/);

var moscaServer = new require('mosca').Server({port: 9999}); // start mosca server for test

var server = jmqtt.server({
	localtime: function (cb) {
		console.log('localtime has been called');
		cb(null, new Date());
	}
}).mqtt('mqtt://localhost:9999', '$rpc/server1/localtime');

