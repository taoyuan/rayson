"use strict";

function noop() {
// noop
}

function isMqttClient(obj) {
	return obj && obj.subscribe && obj.publish;
}

exports.connect = function connect(client, options) {
	if (!isMqttClient(client)) {
		client = require('mqtt').connect(client);
	}
	options = options || {};
	var router = require('mqtt-router').wrap(client);
	var codec = require('./codecs').byName(options.format || 'json');

	return {
		client: client,
		router: router,
		subscribe: function(topic, opts, handler) {
			// .subscribe('topic', handler)
			if ('function' === typeof opts) {
				handler = opts;
				opts = null;
			}
			handler = handler || noop;
			topic = topic.replace(/:/g, '+:');
			return router.subscribe(topic, opts, function (err, msg) {
				handler(err, msg ? codec.decode(msg) : msg);
			});
		},
		publish: function(topic, msg, cb) {
			client.publish(topic, codec.encode(msg), cb);
		}
	}
};
