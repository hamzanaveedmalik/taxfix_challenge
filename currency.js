/*

	currency.js

*/

var Q = require("q");
var HTMLParser = require('fast-html-parser');
var request = require('request');

var TaxfixCurrency = function(dbObj) {
	var self = this;
	this.dbObj = dbObj;
	this.currencyList = [];
	this.loadCurrencyList = function() {
		request('https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html', 
			function (error, response, body) {

		  const root = HTMLParser.parse(body);
		  const table = root.querySelector('.ecb-forexTable');
		  const tbody = table.querySelector('tbody');
		  for (var i = 1; i < 64; i+=2) {
		  	var str = tbody.childNodes[i].text+"";
			var contents = str.split("\n");
			var obj = {
				currency:contents[1].trim(),
				alignLeft:contents[2].trim(),
				rate:Number(contents[4])
			};
			self.currencyList.push(obj);
		  }
		});
	}
	this.loadCurrencyList();
	this.getCurrencyList = function() {
		return self.currencyList;
	}
	this.saveCalculateHistory = function(from, to, rate, amount, result) {
		var deferred = Q.defer();
		var calculateLogs = self.dbObj.collection('calculateLogs');
		var object = {
			from_currency:from,
			to_currency:to,
			rate:rate,
			amount:amount,
			result:result,
			created_at:new Date()
		};
		calculateLogs.save(object, function(err, result) {
			if (err) deferred.reject(err);
			else deferred.resolve(result);
		});
		return deferred.promise;
	}
	this.loadCalculateHistory = function() {
		var deferred = Q.defer();
		var calculateLogs = self.dbObj.collection('calculateLogs');
		calculateLogs.find({}).sort({createdAt:-1}).toArray(function(err, results) {
			if (err) deferred.reject(err);
			else deferred.resolve(results);
		});
		return deferred.promise;
	}
	this.calculateCurrencyInfo = function(from, to, amount) {
		var result = 0.0;
		if (from == "EUR") {//EUR --> Other
			for (var i = 0; i < self.currencyList.length; i++) {
				if (to == self.currencyList[i].currency) {
					result = amount * self.currencyList[i].rate;
					if (self.dbObj != null) {
						self.saveCalculateHistory(from, to, self.currencyList[i].rate, amount, result);
					}
					break;
				}
			}
		} else {//Other --> EUR
			for (var i = 0; i < self.currencyList.length; i++) {
				if (from == self.currencyList[i].currency) {
					result = amount / self.currencyList[i].rate;
					if (self.dbObj != null) {
						self.saveCalculateHistory(from, to, self.currencyList[i].rate, amount, result);
					}
					break;
				}
			}
		}
		return result;
	}
}


