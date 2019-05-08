const EventedModel = require('./evented-model');
const constants = require('../../libs/constants.js');
const externalEvents = constants.externalEvents;
const bus = require('framebus');
const validator = require('../../card-validator');
const CardDefault = require('./card-default.js');
const getCardTypes = require('../../card-type');
const comparePossibleCardTypes = require('../compare-card-type.js');
const events = require('../../hosted-fields/events.js');

const CreditCardForm = function (conf) {


    // Filter Key options :TODO
    /**
     *  returns an array of field keys
     *  for example
     *  ["pan", "pin", "exp"]
     *
     *
     */

    this._fieldKeys = Object.keys(conf.fields).filter(function (key) {
        return true;
    });

    console.log("Keys for fields " + JSON.stringify(this._fieldKeys) + ">>>");

    EventedModel.apply(this, arguments);

    /**
     * Initialize the tree with default data
     *
     * {
     *  pan: {
     *      value: "",
     *      isEmpty: true,
     *      isFocused: true,
     *      isValid: false,
     *      isPotentiallyValid: false
     *  },
     * cvv: {
     *      value: "",
     *      isEmpty: true,
     *      isFocused: false,
     *      isValid: false,
     *      isPotentiallyValid: false
     *  },
     * exp: {
     *      value: "",
     *      isEmpty: true,
     *      isFocused: true,
     *      isValid: false,
     *      isPotentiallyValid: false
     *  },
     * pin: {
     *      value: "",
     *      isEmpty: true,
     *      isFocused: true,
     *      isValid: false,
     *      isPotentiallyValid: false
     *  }
     * }
     */

    this.initialize(CardDefault);

    this.conf = conf;

    /**
     *
     * iterate over all the fields
     * for example
     * ["cvv", "pan"]
     *
     */

    this._fieldKeys.forEach(function (field) {

        const onFieldChange = onFieldStateChange(this, field);//pass the entire form state to be processed

        this.on('change:' + field + '.value', onFieldValueChange(this, field));
        this.on('change:' + field + '.isFocused', onFieldFocusChange(this, field));
        this.on('change:' + field + '.isValid', onFieldChange);
        this.on('change:' + field + '.isPotentiallyValid', onFieldChange);
        this.on('change:' + field + '.isEmpty', onEmptyChange(this, field));

    }.bind(this));

    this.on('change:pan.value', this._onNumberChange);
    this.on('change:possibleCardTypes', function () {
        this._validateField('cvv');
    }.bind(this));
    //this.on('change:possibleCardTypes', onCardTypeChange(this, 'pan'));

};

CreditCardForm.prototype = Object.create(EventedModel.prototype);
CreditCardForm.prototype.constructor = CreditCardForm;


CreditCardForm.prototype.emitEvent = function (fieldKey, eventType) {
    let cards;

    const possibleCardTypes = this.get('possibleCardTypes');
    const fields = this._fieldKeys.reduce(function (result, key) {

        const fieldData = this.get(key);

        if (fieldData) {
            result[key] = {
                isEmpty: fieldData.isEmpty,
                isValid: fieldData.isValid,
                isPotentiallyValid: fieldData.isPotentiallyValid,
                isFocused: fieldData.isFocused
            };
        }
        return result;
    }.bind(this), {});

    if (possibleCardTypes) {
        cards = possibleCardTypes.map(function (cardType) {
            return {
                common: cardType.common,
                type: cardType.type,
                code: cardType.code
            };
        });
    }

    console.log("before emitting INPUT_EVENT " + JSON.stringify(fields));

    bus.emit(events.INPUT_EVENT, {
        merchantPayload: {
            cards: cards,
            emittedBy: fieldKey,
            fields: fields
        },
        type: eventType
    });
};
/////////////////////////////////////////////////////////////
CreditCardForm.prototype._onNumberChange = function (number) {

    const newPossibleCardTypes = getCardTypes(number.replace(/[-\s]/g, ''));
    const oldPossibleCardTypes = this.get('possibleCardTypes');

    if (!comparePossibleCardTypes(newPossibleCardTypes, oldPossibleCardTypes)) {
        this.set('possibleCardTypes', newPossibleCardTypes);
    }
};

CreditCardForm.prototype._validateField = function (fieldKey) {
    console.log("Validating fieldKey " + fieldKey);
    let validationResult;

    const value = this.get(fieldKey + '.value');
    const validate = validator[fieldKey];

    if (fieldKey === 'cvv') {
        console.log("on validating cvv ");
        validationResult = this._validateCvv(value);
        console.log(validationResult);
    }
    else {
        //validate pan , pin, exp
        validationResult = validate(value);
    }

    console.log("The validation resule::::::" + JSON.stringify(validationResult));
    this.set(fieldKey + '.isValid', validationResult.isValid);
    this.set(fieldKey + '.isPotentiallyValid', validationResult.isPotentiallyValid);

};

CreditCardForm.prototype._validateCvv = function (value) {
    console.log("validating cvv");
    return validator.cvv(value, 3);
};

CreditCardForm.prototype.getCardData = function () {
    let expirationData;
    const result = {};
    let keys = [];

    console.log("Original keys are ", this._fieldKeys);
    keys = this._fieldKeys.slice(0);
    console.log("Copied keys are ", keys);

    if (this._fieldKeys.indexOf('expirationDate') !== -1) {
        //expirationData = splitDate(this.get('expirationDate.value'));
        console.log(expirationData);
        //result.expirationMonth = expirationData.month;
        //result.expirationYear = expirationData.year;
    }

    keys.reduce(function (reducedResult, name) {
        reducedResult[name] = this.get(name + '.value');
        return reducedResult;
    }.bind(this), result);

    //console.log(JSON.stringify(result));
    return result;
};

CreditCardForm.prototype.isEmpty = function () {
    let count = 0;
    this._fieldKeys.forEach(function (key) {
        if (key && this.get(key).value.length === 0) {
            count += 1;
        }
    }.bind(this));
    return count === this._fieldKeys.length;
};

CreditCardForm.prototype.getInvalidFormField = function () {
    let tokenOrCard = this.get(constants.formMap.cardvstokenradio.name).value;
    return this._fieldKeys.filter(function (key) {
        if (key === 'pan' && tokenOrCard === 'token')
            return false;
        else if (key === 'token' && tokenOrCard === 'card')
            return false;
        return !this.get(key).isValid;
    }.bind(this));
};

function onFieldValueChange(form, fieldKey) {

    return function () {
        const isEmpty = form.get(fieldKey + '.value');
        form.set(fieldKey + '.isEmpty', isEmpty === '');
        form._validateField(fieldKey);
    };


}

function onFieldFocusChange(form, field) {

    return function (isFocused) {
        form._fieldKeys.forEach(function (key) {
            if (key === field) {
                return;
            }
            form.set(key + '.isFocused', false);
        });

        form.emitEvent(field, isFocused ? externalEvents.FOCUS : externalEvents.BLUR);
    };
}

function onCardTypeChange(form, field) {
    return function () {
        form.emitEvent(field, externalEvents.CARD_TYPE_CHANGE);
    };
}

function onEmptyChange(form, field) {

    return function () {
        const event = form.get(field + '.isEmpty') ? externalEvents.EMPTY : externalEvents.NOT_EMPTY;
        form.emitEvent(field, event);
    };
}

/**
 * returns a function value for when there is a state change
 * @param form: credit-card-form
 * @param field: string
 */
function onFieldStateChange(form, field) {
    return function () {
        form.emitEvent(field, externalEvents.VALIDITY_CHANGE);
    };
}

function splitDate(date) {

}

module.exports = {
    CreditCardForm: CreditCardForm
};
