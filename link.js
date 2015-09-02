var async = require('async');
var db = require('./db');

exports.generateLink = function(link, next) {
	var code = '';
	var choices = ["a", "b", "c", "d", "e", "f", "g",
		"h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
		"u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", 
		"7", "8", "9"];

	for (var i = 0; i < 7; i++) {
		var index = Math.floor(Math.random() * 36);
		code += choices[index];
	}

	if (link.indexOf('://') == -1) {
		link = 'http://' + link;
	}

	async.waterfall([
		function(cb) {
			queryCode(code, cb);
		},
		function(found, cb) {
			if (found) {
				return generateLink(link, next);
			}
			cb();
		},
		function(cb) {
			saveCode(code, link, cb);
		}
	], function(err) {
		if (err) {
			return next(err);
		}

		next(null, code);
	});
}

function queryCode(code, next) {
	var query = {
		text: 'SELECT * FROM links WHERE code = $1',
		values: [code]
	};

	db.runQuery(query, function(err, results) {
		if (err) {
			return next(err);
		}

		if (results.rows.length == 0) {
			next(null, false);
		} else {
			next(null, true);
		}
	});
}

function saveCode(code, link, next) {
	var query = {
		text: 'INSERT INTO links (code, link) values ($1, $2)',
		values: [code, link]
	};

	db.runQuery(query, function(err, results) {
		if (err) {
			return next(err);
		}

		next(null);
	});
}

exports.getLink = function(code, next) {
	var query = {
		text: 'SELECT * FROM links WHERE code = $1',
		values: [code]
	};

	db.runQuery(query, function(err, results) {
		if (err) {
			return next(err);
		}

		if (results.rows.length <= 0) {
			return next('Unable to find matching link.');
		}
		next(null, results.rows[0]);
	});
};