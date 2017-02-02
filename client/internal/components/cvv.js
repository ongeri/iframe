var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 3;


var cvvInput = function(options) {

    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);

    

};

cvvInput.prototype = Object.create(BaseInput.prototype);
cvvInput.constructor = cvvInput;

module.exports = {
    CVVINPUT: cvvInput
};