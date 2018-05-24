var express = require('express');
var router = express.Router();

var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/currency', function(req, res, next) {
	res.send(db.getTaxfixCurrency().getCurrencyList());
});

router.get('/currency/calc', function(req, res, next) {
	if (req.query.from != null && req.query.from != undefined && req.query.from != '') {
		if (req.query.to != null && req.query.to != undefined && req.query.to != '') {
			if (req.query.amount != null && req.query.amount != undefined && req.query.amount != '') {
				if (req.query.from != req.query.to && Number(req.query.amount) > 0) {
					var result = db.getTaxfixCurrency().calculateCurrencyInfo(req.query.from, req.query.to, req.query.amount);
					res.send({from_currency:req.query.from,to_currency:req.query.to,result:result.toFixed(5)});
				} else {
					res.send({Error:'Invalid Parameters'});
				}
			} else {
				res.send({Error:'Invalid Parameters'});
			}
		} else {
			res.send({Error:'Invalid Parameters'});
		}
	} else {
		res.send({Error:'Invalid Parameters'});
	}
});

router.get('/currency/logs', function(req, res, next) {
	db.getTaxfixCurrency().loadCalculateHistory().then(function(results) {
		res.send(results);
	});
});

module.exports = router;
