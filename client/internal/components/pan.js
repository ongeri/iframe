var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 19;

var panInput = function () {
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);

    let element = this.element;
//    console.log("Pan element was created as", element);
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

    this.model.on("change:possibleCardTypes", function (possibleCardTypes) {


    }.bind(this));
};

panInput.prototype = Object.create(BaseInput.prototype);
panInput.constructor = panInput;

module.exports = {
    PAN: panInput
};
