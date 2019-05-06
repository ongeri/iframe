var LabelComponent = require('./label.js');
var InputLabelComponent = require('./input-components.js');
var constants = require('../../libs/constants');

var fieldComponent = function (options) {

    var type = options.type;

    //this.element = document.createDocumentFragment();
    this.element = document.createElement("div");

    this.element.style.width = "100%";

    this.element.style.position = "relative";

    var formMap = constants.formMap[type];

    //this.element.appendChild(new LabelComponent(formMap).element);

    console.log("type of input " + type);

    var inputElem = new InputLabelComponent[type]({
        model: options.model,
        type: type
    });

    if (type === "pan") {
        var spanElement = document.createElement("span");

        spanElement.style.position = "absolute";
        spanElement.style.right = "0";
        spanElement.style.top = "1";
        spanElement.style.width = "50px";
        spanElement.style.backgroundRepeat = "no-repeat";
        spanElement.style.backgroundSize = "35px";
        spanElement.style.height = "50px";
        spanElement.style.marginTop = "7px";

        /**
         * Add event listener to act when a card change happens
         *
         **/

        options.model.on('change:possibleCardTypes', function (data) {
            console.log("on card type change " + JSON.stringify(data) + " " + data);
            if (!data) {
                spanElement.style.display = 'none';
                return;
            }
            if (data.length == 0) {
                //hide span element
                spanElement.style.display = 'none';
            }
            else if (data.length > 1) {
                spanElement.style.display = 'none';
            }

            else { // at this point there is only one

                var simpleName = data[0].type;
                spanElement.style.display = 'block';
                var urlName = "../../images/card-brands/" + simpleName + ".png";
                console.log(urlName);
                spanElement.style.backgroundImage = 'url(' + urlName + ')';

            }
        });

        /**
         * set position styles on this element
         */
        this.element.appendChild(spanElement);
    }

    if (!inputElem.model.fieldComponents)
        inputElem.model.fieldComponents = [];
    inputElem.element.fieldType = type;
    inputElem.model.fieldComponents.push(inputElem.element);
    this.element.appendChild(inputElem.element);
};
module.exports = {
    FieldComponent: fieldComponent
};
