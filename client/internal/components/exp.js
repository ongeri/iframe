var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 5;

var expInput = function(){
    this.MAX_SIZE = MAX_SIZE;
    this.hasSlash = false;

    BaseInput.apply(this, arguments);
};

expInput.prototype = Object.create(BaseInput.prototype);
expInput.constructor = expInput;

module.exports = {
    EXP: expInput
};