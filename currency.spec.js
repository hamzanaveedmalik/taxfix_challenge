/* Test */
const assert = require('assert');
const TaxfixCurrency = require('./currency.js');

describe('TaxfixCurrency Test suit', function() {
	this.timeout(3000);
	var taxfixCurrency = null;

	before('Create Instance', function() {
		taxfixCurrency = new TaxfixCurrency(null);
		taxfixCurrency.currencyList = [{"currency":"USD","alignLeft":"US dollar","rate":1.1708}];		
	});

	after('Destroy Instance', function() {
		taxfixCurrency = undefined;
	})

	it('Should be ok', function() {
		assert.equal(taxfixCurrency, null);
	});

	it('Test getCurrencyList', function() {
		assert.equal(taxfixCurrency.getCurrencyList().length, 0);
	});

	it('Test calculateCurrencyInfo (USD->EUR)', function() {
		assert.equal(taxfixCurrency.calculateCurrencyInfo("USD","EUR",10), 8);
	});

	it('Test calculateCurrencyInfo (EUR->USD)', function() {
		assert.equal(taxfixCurrency.calculateCurrencyInfo("EUR","USD",10), 11);
	});
});