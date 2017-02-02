var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 4;

var expInput = function(){
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);
};

expInput.prototype = Object.create(BaseInput.prototype);
expInput.constructor = expInput;

module.exports = {
    EXP: expInput
};