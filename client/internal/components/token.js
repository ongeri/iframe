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

    // Source: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    // Options for the observer (which mutations to observe)
    const config = {attributes: true};

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            console.log('A mutation occurred', mutation);
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                console.log('The element\'s style changed');
                if (element.style.display === 'none') {
                    //    Hide parent body
                    document.body.style.display = 'none';
                    document.body.style.margin = '0px';
                } else {
                    //    show parent body
                    document.body.style.display = 'block';
                    document.body.style.margin = '8px';
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(element, config);

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
