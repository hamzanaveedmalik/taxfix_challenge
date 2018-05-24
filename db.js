const TaxfixCurrency = require('./currency.js');
const config = require('./config');
const { db:{host,port,name}} = config;

console.log(host);
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://'+host+':'+port;
console.log(url);

var db = {};
 
var taxfixCurrency = null;
MongoClient.connect(url, function(err, client) {
	if (err) {
		console.log(err);
		taxfixCurrency = new TaxfixCurrency(null);
	} else {
		console.log("Connected successfully to server");
		const db = client.db(name);
 		taxfixCurrency = new TaxfixCurrency(db);
	}
});

db.getTaxfixCurrency = function() {
	return taxfixCurrency;
};

module.exports = db;