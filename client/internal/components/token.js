const BaseInput = require('./base-input.js').BaseInput;
const MAX_SIZE = 19;
const constants = require('../../libs/constants');

function buildElement() {

    console.info("Overriden method called");

    let inputType = this.getConfiguration().type || 'tel';

    // Create dropdopwn element
    const element = document.createElement('select');
    // For each token provided add an option
    const tokens = [
        {
            pan: '411111******1111',
            token: 'somereallylongnumber'
        },
        {
            pan: 'someothermaskedpan',
            token: 'someotherreallylongnumber'
        }];
    tokens.forEach(token => {
        element.options[element.options.length] = new Option(token.pan, token.token);
    });

    element.style.width = "100%";

    const formMap = constants.formMap[this.type];

    const name = formMap.name;

    const attributes = {
        type: inputType,
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'none',
        spellcheck: 'false',
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
    this.MAX_SIZE = MAX_SIZE;

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
