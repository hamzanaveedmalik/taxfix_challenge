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

isValidParameter = function(param) {
	if (param != null && param != undefined && param != '') {
		return true;
	} else {
		return false;
	}
}
checkCurrency = function(currency1, currency2) {
	if (isValidParameter(currency1) && isValidParameter(currency2) && currency1 != currency2) {
		return true;
	} else {
		return false;
	}
}
checkAmount = function(amount) {
	if (isValidParameter(amount) && Number(amount) > 0) {
		return true;
	} else {
		return false;
	}
}

router.get('/currency/calc', function(req, res, next) {
	if (checkCurrency(req.query.from, req.query.to) && checkAmount(req.query.amount)) {
		var result = db.getTaxfixCurrency().calculateCurrencyInfo(req.query.from, req.query.to, req.query.amount);
		res.send({from_currency:req.query.from,to_currency:req.query.to,result:result.toFixed(5)});
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
