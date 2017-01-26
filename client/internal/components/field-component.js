
var LabelComponent = require('./label.js');
var InputLabelComponent = require('./input-components.js').cvv;

var fieldComponent = function(options) {

    var type = options.type;

    this.element = document.createDocumentFragment();

    this.element.appendChild(new LabelComponent({
        name: 'cvv',
        label: 'CVV'
    }).element);

    var inputElem = new InputLabelComponent.CVVINPUT({
        model: options.model,
        type: type
    });

    this.element.appendChild(inputElem.element);
};
module.exports = {
    FieldComponent : fieldComponent
};