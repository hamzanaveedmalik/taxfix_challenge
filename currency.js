/*

	currency.js

*/

var HTMLParser = require('fast-html-parser');
var parseString = require('xml2js').parseString;
var request = require('request');

var TaxfixCurrency = function(dbObj) {
	var self = this;
	this.dbObj = dbObj;
	this.currencyList = [];
	this.loadCurrencyList = function() {
		request('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', 
			function (error, response, body) {
			if (error) console.log(error);
			else {
				parseString(body, function (err, result) {
				    const cubes = result["gesmes:Envelope"]["Cube"][0]["Cube"][0]["Cube"];
					for (var i = 0; i < cubes.length; i++) {
						var obj = {
							currency:cubes[i]["$"].currency,
							rate:Number(cubes[i]["$"].rate)
						};
						self.currencyList.push(obj);
					}
				});
			}
		});
	}
	this.loadCurrencyList();
	this.getCurrencyList = function() {
		return self.currencyList;
	}
	this.saveCalculateHistory = function(from, to, rate, amount, result) {
		return new Promise(function(resolve, reject) {
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
				if (err) reject(err);
				else resolve(result);
			});
		});
	}
	this.loadCalculateHistory = function() {
		return new Promise(function(resolve, reject) {
			var calculateLogs = self.dbObj.collection('calculateLogs');
			calculateLogs.find({}).sort({createdAt:-1}).toArray(function(err, results) {
				if (err) reject(err);
				else resolve(results);
			});
		});
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

module.exports = TaxfixCurrency;

