var LabelComponent = require('./label.js');
var InputLabelComponent = require('./input-components.js');
var constants = require('../../libs/constants');

var fieldComponent = function (options) {

    var type = options.type;

    this.element = document.createDocumentFragment();

    var formMap = constants.formMap[type];

    //this.element.appendChild(new LabelComponent(formMap).element);

    var inputElem = new InputLabelComponent[type]({
        model: options.model,
        type: type
    });

    this.element.appendChild(inputElem.element);
};
module.exports = {
    FieldComponent: fieldComponent
};