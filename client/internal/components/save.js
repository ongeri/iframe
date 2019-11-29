const BaseInput = require('./base-input.js').BaseInput;
const constants = require('../../libs/constants');

function buildElement() {

    const element = document.createElement('div');
    const saveCheckbox = document.createElement('input');
    saveCheckbox.type = "checkbox";
    saveCheckbox.value = "tokenize";
    saveCheckbox.checked = true;
    saveCheckbox.style.width = 'auto';
    saveCheckbox.style.verticalAlign = 'middle';
    saveCheckbox.style.margin = '4px';

    const formMap = constants.formMap[this.type];

    const name = formMap.name;

    const attributes = {
        'class': this.type,
        'data-isw-name': this.type,
        name: name,
        id: name
    };

    Object.keys(attributes).forEach(function (attr) {
        saveCheckbox.setAttribute(attr, attributes[attr]);
    });

    const label = document.createElement('label');
    label.htmlFor = saveCheckbox.getAttribute("id");
    label.appendChild(document.createTextNode('Save Card'));
    label.style.verticalAlign = 'middle';
    label.style.color = "#888";
    label.style.fontFamily = "sans-serif";
    label.style.fontSize = "small";

    element.setAttribute('name', name);
    element.appendChild(saveCheckbox);
    element.appendChild(label);

    // Source: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    // Options for the observer (which mutations to observe)
    const config = {attributes: true};

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
//            console.log('A mutation occurred', mutation);
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
//                console.log('The element\'s style changed');
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

const saveInput = function () {
    // Override buildElement from BaseInput to render our dropdown input
    this.buildElement = buildElement;

    BaseInput.apply(this, arguments);

};

saveInput.prototype = Object.create(BaseInput.prototype);
saveInput.constructor = saveInput;

module.exports = {
    SAVE: saveInput
};
