var pg = require('pg');

require('dotenv').load();

var connection = process.env.CONNECTION_STRING

exports.runQuery = function(query, next) {
	pg.connect(connection, function(err, client, done) {
		if (err) {
			return next(err);
		}

		client.query(query, function(err, results) {
			done();
			next(err, results);
		});
	});
};