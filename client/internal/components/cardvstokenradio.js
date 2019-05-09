const BaseInput = require('./base-input.js').BaseInput;
const constants = require('../../libs/constants');

function buildElement() {

    console.info("Overriden method called");

    const formMap = constants.formMap[this.type];

    const name = formMap.name;
    // Create container element for the radio buttons
    const element = document.createElement('div');
    // Parse the passed token string into an array of tokens and add the parsed token array to our model
    this.model.conf.tokens = JSON.parse(this.model.conf.cardTokensJson);
    const radioValues = ['card', 'token'];
    // For each value provided add an option
    radioValues.forEach(radioValue => {
        const radioInput = document.createElement('input');
        radioInput.setAttribute('type', 'radio');
        radioInput.setAttribute('data-isw-name', this.type);
        radioInput.setAttribute('name', name);
        radioInput.setAttribute('id', radioValue);
        radioInput.setAttribute('value', radioValue);
        radioInput.checked = true;
        radioInput.style.width = "auto";
        const radioInputLabel = document.createElement('label');
        radioInputLabel.setAttribute('for', radioValue);
        radioInputLabel.innerHTML = radioValue;
        radioInputLabel.style.color = 'black';
        element.appendChild(radioInput);
        element.appendChild(radioInputLabel);
    });
    element.setAttribute('name', name);
    return element;
}

const cardvstokenradio = function () {
    // Override buildElement from BaseInput to render our dropdown input
    this.buildElement = buildElement;

    BaseInput.apply(this, arguments);

    this.model.on("change:possibleCardTypes", function (possibleCardTypes) {

    }.bind(this));
};

cardvstokenradio.prototype = Object.create(BaseInput.prototype);
cardvstokenradio.constructor = cardvstokenradio;

module.exports = {
    CARDVSTOKENRADIO: cardvstokenradio
};
