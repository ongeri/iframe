var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 19;

var tokenInput = function () {
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);

    this.model.on("change:possibleCardTypes", function (possibleCardTypes) {


    }.bind(this));
};

tokenInput.prototype = Object.create(BaseInput.prototype);
tokenInput.constructor = tokenInput;

module.exports = {
    TOKEN: tokenInput
};
