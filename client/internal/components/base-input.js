const bus = require('framebus');
const createRestrictedInput = require('../../libs/create-restricted-input.js');
const constants = require('../../libs/constants');
const isIe9 = require('../../libs/is-ie9.js');
const toggler = require('../../libs/class-toggle.js');
const events = constants.events;
const ENTER_KEY_CODE = 13;

function BaseInput(options) {
    let shouldFormat;

    this.type = options.type;

    this.model = options.model;

    this.element = this.buildElement();

    if (this.MAX_SIZE) {
        this.element.setAttribute('maxlength', this.MAX_SIZE);
    }
    shouldFormat = this.getConfiguration().formatInput !== false && this.element instanceof HTMLInputElement;
    console.log("shouldFormat " + shouldFormat);
    this.formatter = createRestrictedInput({
        shouldFormat: false,
        element: this.element,
        pattern: ' '
    });

    this.addDOMEventListeners();
    this.addModelEventListeners();
    this.addBusEventListeners();
    this.render();

}

BaseInput.prototype.buildElement = function () {


    const type = this.type;

    let inputType = this.getConfiguration().type || 'tel';

    if (type === "pin") {

        inputType = 'password'
    }

    const element = document.createElement('input');

    /**
     * 1. For input element we want to
     * add a width of 100%
     * if the input field is a pan, we want to add a padding-right
     *
     *
     */
    element.style.width = "100%";

    console.log("checking the type at input element creation");
    if (type === "pan") {
        element.style.paddingRight = "55px";
    }

    const placeholder = this.getConfiguration().placeholder;

    const formMap = constants.formMap[type];

    const name = formMap.name;

    const attributes = {
        type: inputType,
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'none',
        spellcheck: 'false',
        'class': type,
        'data-isw-name': type,
        name: name,
        id: name
    };

    if (placeholder) {
        attributes.placeholder = placeholder;
    }


    Object.keys(attributes).forEach(function (attr) {
        element.setAttribute(attr, attributes[attr]);
    });

    return element;

};

BaseInput.prototype.getConfiguration = function () {
    return this.model.conf.fields[this.type];
};

BaseInput.prototype.addDOMEventListeners = function () {
    this._addDOMFocusListeners();
    this._addDOMInputListeners();
    this._addDOMKeypressListeners();
};

/**
 * For any focus event, this.updateModel('isFocused', false|true);
 */
BaseInput.prototype._addDOMFocusListeners = function () {

    const element = this.element;

    if ('onfocusin' in document) {
        document.documentElement.addEventListener('focusin', function (event) {
            if (event.fromElement === element) {
                return;
            }
            if (event.relatedTarget) {
                return;
            }

            element.focus();
        }, false);
    } else {
        document.addEventListener('focus', function () {
            element.focus();
        }, false);
    }

    element.addEventListener('touchstart', function () {
        element.select();
    });

    element.addEventListener('focus', function () {
        this.updateModel('isFocused', true);
    }.bind(this), false);

    element.addEventListener('blur', function () {
        this.updateModel('isFocused', false);
    }.bind(this), false);


};

BaseInput.prototype._addDOMKeypressListeners = function () {

    this.element.addEventListener('keypress', function (event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            this.model.emitEvent(this.type, 'inputSubmitRequest');
        }
    }.bind(this), false);

};

const validInput = (value, type, context) => {
    if (value.length > 0) {
        const lastChar = value.charAt(value.length - 1);
        if (type === "exp") {
            return (value.length === 3 && lastChar === '/') || !isNaN(lastChar);
        }
        if (type === "token") {
            return true;
        }
        if (type === constants.formMap.cardvstokenradio.name) {
            return true;
        }
        if (type === constants.formMap.save.name) {
            return true;
        }
        return !isNaN(lastChar);
    }
    return true;
};

BaseInput.prototype._addDOMInputListeners = function () {
    this.element.addEventListener(this._getDOMChangeEvent(), function () {
        let valueChanged = this.getUnformattedValue();

        if (!validInput(valueChanged, this.type, this)) {
            valueChanged = valueChanged.substring(0, valueChanged.length - 1);
            this.formatter.setValue(valueChanged);
            return;
        }

        if (this.type === "exp" && valueChanged && valueChanged.length > 0) {
            if (!this.hasSlash) {
                valueChanged = valueChanged.charAt(0) === '0' || valueChanged.charAt(0) === '1' ? valueChanged : "0" + valueChanged;
                valueChanged = valueChanged.replace(/\D/g, '');//Remove all non numeric characters
                if (valueChanged.length > 1) {
                    valueChanged = valueChanged.substring(0, 2) + "/" + valueChanged.substring(2, valueChanged.length);
                    this.hasSlash = true;
                }
            }
            else {

                if (valueChanged.length === 2) {

                    valueChanged = valueChanged.substring(0, 1);
                    this.hasSlash = false;
                }

            }


            this.formatter.setValue(valueChanged);
        }

        if (this.type === "pan" && valueChanged && valueChanged.length > 3) {

            valueChanged = valueChanged.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();

            this.formatter.setValue(valueChanged);
        }
        if (this.type === "token") {
            const selectedTokenObject = this.model.conf.tokens.find((token) => {
                return token.token === valueChanged
            });
            const expInputField = this.model.fieldComponents.find((fieldComponent) => {
                return fieldComponent.fieldType === 'exp';
            });
            expInputField.value = selectedTokenObject.expiry;
            fireEvent(expInputField, 'input');
            console.log("matched token object: ", selectedTokenObject);
        }

        if (this.type === constants.formMap.cardvstokenradio.name) {
            const expInputField = this.model.fieldComponents.find((fieldComponent) => {
                return fieldComponent.fieldType === 'exp';
            });
            const cardInputContainer = this.model.fieldComponents.find((fieldComponent) => {
                return fieldComponent.fieldType === 'pan';
            });
            const tokenInputContainer = this.model.fieldComponents.find((fieldComponent) => {
                return fieldComponent.fieldType === 'token';
            });
            const saveCardInputContainer = this.model.fieldComponents.find((fieldComponent) => {
                return fieldComponent.fieldType === 'save';
            });
            if (valueChanged === 'token') {
                cardInputContainer.style.display = 'none';
                // cardInputContainer.offsetParent.offsetParent.style.height = '0px';
                tokenInputContainer.style.display = 'block';
                // tokenInputContainer.offsetParent.offsetParent.style.height = 'auto';
                fireEvent(tokenInputContainer, 'input');
                // Disable expiry input and set it using token expiry
                if (saveCardInputContainer) {
                    saveCardInputContainer.style.display = 'none';
                    fireEvent(saveCardInputContainer, 'input');
                }
                expInputField.disabled = true;
            } else {
                cardInputContainer.style.display = 'block';
                // cardInputContainer.offsetParent.offsetParent.style.height = 'auto';
                tokenInputContainer.style.display = 'none';
                // tokenInputContainer.offsetParent.offsetParent.style.height = '0px';
                expInputField.disabled = false;
                if (saveCardInputContainer) {// It may be null depending on merchant config
                    saveCardInputContainer.style.display = 'block';
                    fireEvent(saveCardInputContainer, 'input');
                }
                expInputField.value = "";
                fireEvent(expInputField, 'input');
            }
        }
        this.updateModel('value', valueChanged);
    }.bind(this), false);
};

function fireEvent(element, event) {
    let evt;
    if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();
        return element.fireEvent('on' + event, evt)
    } else {
        // dispatch for firefox + others
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}

BaseInput.prototype._getDOMChangeEvent = function () {
    return isIe9() ? 'keyup' : 'input';
};

BaseInput.prototype.updateModel = function (key, value) {
    this.model.set(this.type + '.' + key, value);
};

BaseInput.prototype.getUnformattedValue = function () {
    return this.formatter.getUnformattedValue();
};

BaseInput.prototype.addModelEventListeners = function () {
    this.modelOnChange('isValid', this.render);
    this.modelOnChange('isPotentiallyValid', this.render);
};

BaseInput.prototype.modelOnChange = function (property, callback) {
    const eventPrefix = 'change:' + this.type;
    const self = this;

    this.model.on(eventPrefix + '.' + property, function () {
        callback.apply(self, arguments);
    });
};

BaseInput.prototype.render = function () {
    let modelData = this.model.get(this.type);
    if (!modelData) {
        modelData = {};
    }
    const isValid = modelData.isValid;
    let isPotentiallyValid = modelData.isPotentiallyValid;

    toggler.toggle(this.element, 'valid', isValid);
    toggler.toggle(this.element, 'invalid', !isPotentiallyValid);

    if (this.maxLength) {
        this.element.setAttribute('maxlength', this.maxLength);
    }
};

BaseInput.prototype.addBusEventListeners = function () {
    bus.on(events.TRIGGER_INPUT_FOCUS, function (type) {
        if (type === this.type) {
            this.element.focus();
        }
    }.bind(this));

    bus.on(events.SET_PLACEHOLDER, this.setPlaceholder.bind(this));

    bus.on(events.ADD_CLASS, function (type, classname) {
        if (type === this.type) {
            toggle.add(this.element, classname);
        }
    }.bind(this));

    bus.on(events.REMOVE_CLASS, function (type, classname) {
        if (type === this.type) {
            toggle.remove(this.element, classname);
        }
    }.bind(this));

    bus.on(events.CLEAR_FIELD, function (type) {
        if (type === this.type) {
            this.element.value = '';
            this.updateModel('value', '');
        }
    }.bind(this));

};

BaseInput.prototype.setPlaceholder = function (type, placeholder) {
    if (type === this.type) {
        this.element.setAttribute('placeholder', placeholder);
    }
};

module.exports = {
    BaseInput: BaseInput
};
