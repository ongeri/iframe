var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 19;

var panInput = function(){
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);

    this.model.on("change:possibleCardTypes", function(possibleCardTypes){
        
        
    }.bind(this));
};

panInput.prototype = Object.create(BaseInput.prototype);
panInput.constructor = panInput;

module.exports = {
    PAN: panInput
};