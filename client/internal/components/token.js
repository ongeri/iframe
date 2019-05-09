const BaseInput = require('./base-input.js').BaseInput;
const constants = require('../../libs/constants');

function buildElement() {

    console.info("Overriden method called");

    // Create dropdopwn element
    const element = document.createElement('select');
    // Parse the passed token string into an array of tokens and add the parsed token array to our model
    this.model.conf.tokens = JSON.parse(this.model.conf.cardTokensJson);
    // For each token provided add an option
    this.model.conf.tokens.forEach(token => {
        element.options[element.options.length] = new Option(token.panFirst6Digits + '******' + token.panLast4Digits, token.token);
    });

    element.style.width = "100%";
    element.style.color = "black";

    const formMap = constants.formMap[this.type];

    const name = formMap.name;

    const attributes = {
        'class': this.type,
        'data-isw-name': this.type,
        name: name,
        id: name
    };

    Object.keys(attributes).forEach(function (attr) {
        element.setAttribute(attr, attributes[attr]);
    });

    return element;
}

const tokenInput = function () {
    // Override buildElement from BaseInput to render our dropdown input
    this.buildElement = buildElement;

    BaseInput.apply(this, arguments);

    this.model.on("change:possibleCardTypes", function (possibleCardTypes) {

    }.bind(this));
};

tokenInput.prototype = Object.create(BaseInput.prototype);
tokenInput.constructor = tokenInput;

module.exports = {
    TOKEN: tokenInput
};
