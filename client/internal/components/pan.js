var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 16;

var panInput = function(){
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);
};

panInput.prototype = Object.create(BaseInput.prototype);
panInput.constructor = panInput;

module.exports = {
    PAN: panInput
};