var express = require('express');
var router = express.Router();

var link = require('../link');

router.get('/:code?', function(req, res, next) {
	var code = req.params.code;
	
	if (code) {
		link.getLink(code, function(err, result) {
			if (err) {
				console.error(err);
				return res.send('Unable to find matching link.');
			}
			return res.redirect(result.link);
		});
	} else {
		return res.render('index', {title: 'Shorten link.'})
	}
	
});

router.post('/', function(req, res, next) {
	var userLink = req.body.link;

	link.generateLink(userLink, function(err, code) {
		if (err) {
			console.error(err);
			return res.send('Unable to generate link.');
		}

		res.send('http://localhost:3000/' + code);
	});
});

module.exports = router;
