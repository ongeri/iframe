const BaseInput = require('./base-input.js').BaseInput;
const constants = require('../../libs/constants');

function buildElement() {

    console.info("Overriden method called");

    // Create dropdopwn element
    const element = document.createElement('select');
    // For each token provided add an option
    const tokens = JSON.parse(this.model.conf.cardTokensJson);
    tokens.forEach(token => {
        element.options[element.options.length] = new Option(token.panFirst6Digits + '******' + token.panLast4Digits, token.token);
    });

    element.style.width = "100%";

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
