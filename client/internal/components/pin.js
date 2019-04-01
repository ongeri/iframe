var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 4;

var pinInput = function () {
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);
};

pinInput.prototype = Object.create(BaseInput.prototype);
pinInput.constructor = pinInput;

module.exports = {
    PIN: pinInput
};