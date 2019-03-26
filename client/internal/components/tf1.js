var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 7;

var tf1Input = function(){
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);
};

tf1Input.prototype = Object.create(BaseInput.prototype);
tf1Input.constructor = tf1Input;

module.exports = {
    TF1: tf1Input
};