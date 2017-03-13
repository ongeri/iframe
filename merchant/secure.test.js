
var SecureManager = require('./secure.lib.js');

//card validator
var validator = require('../client/card-validator');

var validatePan = validator["pan"];

console.log(validatePan("5060990580000217499"));

/**
 * Tunji 
 * 5060990580000217499
 * 04/20
 * 111
 * 1111
 */
var inputObj = {
    pan: "5060990580000217499",
    expDate: "2004",
    pin: "1111",
    cvv: "111",
    amount: 10000
};
var runTest = function(options){
    var pan = options.pan || null;
    var expDate = options.expDate || null;
    var cvv = options.cvv || null;
    var pin = options.pin || null;
    var amount = options.amount || null;
    var mobile = options.mobile || null;
    var ttId = options.ttId || null;
    var publicModulus = options.publicModulus || null;
    var publicExponent = options.publicExponent || null;
	
	var secureOptions = {
		expiry: expDate,
		pan: pan,
		amount: amount,
		mobile: mobile,
		ttId: ttId		
	};
	
	var pinData = {
		pin: pin,
		cvv: cvv,
		expiry: expDate
	};
	
	return SecureManager.generateSecureData(secureOptions, pinData);
};


//test funtion  runTest(inputObj)
// var ans = runTest(inputObj);
// console.log("result from : "+JSON.stringify(ans));