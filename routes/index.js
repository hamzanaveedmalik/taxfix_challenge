var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var fs = require('fs');  
eval(fs.readFileSync('currency.js', 'utf-8'));

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://app_db:27017';
const dbName = 'taxfix';
 
var taxfixCurrency = null;
MongoClient.connect(url, function(err, client) {
	if (err) {
		console.log(err);
		taxfixCurrency = new TaxfixCurrency(null);
	} else {
		console.log("Connected successfully to server");
		const db = client.db(dbName);
 		taxfixCurrency = new TaxfixCurrency(db);
	}
});

router.get('/currency', function(req, res, next) {
	res.send(taxfixCurrency.getCurrencyList());
});

router.get('/currency/calc', function(req, res, next) {
	if (req.query.from != null && req.query.from != undefined && req.query.from != '') {
		if (req.query.to != null && req.query.to != undefined && req.query.to != '') {
			if (req.query.amount != null && req.query.amount != undefined && req.query.amount != '') {
				if (req.query.from != req.query.to && Number(req.query.amount) > 0) {
					var result = taxfixCurrency.calculateCurrencyInfo(req.query.from, req.query.to, req.query.amount);
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
	taxfixCurrency.loadCalculateHistory().then(function(results) {
		res.send(results);
	});
});

module.exports = router;
