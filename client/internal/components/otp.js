var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 7;

var otpInput = function(){
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);
};

otpInput.prototype = Object.create(BaseInput.prototype);
otpInput.constructor = otpInput;

module.exports = {
    OTP: otpInput
};