
var EventedModel = require('./evented-model');
var CreditCardForm = function(conf){
    console.log("creating credit card form");

    // Filter Key options :TODO
    this._fieldKeys = Object.keys(conf.fields).filter(function (key) {
        return true;
    });

    EventedModel.apply(this, arguments);

    this.conf = conf;

    this._fieldKeys.forEach(function (field) {
        var onFieldChange = onFieldStateChange(this, field);

        this.on('change:' + field + '.value', onFieldValueChange(this, field));
        this.on('change:' + field + '.isFocused', onFieldFocusChange(this, field));
        this.on('change:' + field + '.isEmpty', onEmptyChange(this, field));

        this.on('change:' + field + '.isValid', onFieldChange);
        this.on('change:' + field + '.isPotentiallyValid', onFieldChange);
  }.bind(this));

    this.on('change:number.value', this._onNumberChange);
    this.on('change:possibleCardTypes', function () { this._validateField('cvv'); }.bind(this));
    this.on('change:possibleCardTypes', onCardTypeChange(this, 'number'));

    //should add event listeners on each of the field :TODO
};

CreditCardForm.prototype = Object.create(EventedModel.prototype);
CreditCardForm.prototype.constructor = CreditCardForm;


/////////////////////////////////////////////////////////////
CreditCardForm.prototype._onNumberChange = function (number) {
  console.log("number change");
};

CreditCardForm.prototype._validateField = function (fieldKey) {

};

CreditCardForm.prototype._validateCvv = function (value) {
  
};

CreditCardForm.prototype.getCardData = function () {
  var expirationData;
  var result = {};
  var keys = [];

  if (this._fieldKeys.indexOf('number') !== -1) {
    keys.push('number');
  }

  if (this._fieldKeys.indexOf('cvv') !== -1) {
    keys.push('cvv');
  }

  if (this._fieldKeys.indexOf('postalCode') !== -1) {
    keys.push('postalCode');
  }

  if (this._fieldKeys.indexOf('expirationMonth') !== -1) {
    keys.push('expirationMonth');
  }

  if (this._fieldKeys.indexOf('expirationYear') !== -1) {
    keys.push('expirationYear');
  }

  if (this._fieldKeys.indexOf('expirationDate') !== -1) {
    expirationData = splitDate(this.get('expirationDate.value'));
    console.log(expirationData);
    result.expirationMonth = expirationData.month;
    result.expirationYear = expirationData.year;
  }

  keys.reduce(function (reducedResult, name) {
    reducedResult[name] = this.get(name + '.value');
    return reducedResult;
  }.bind(this), result);

  return result;
};

CreditCardForm.prototype.isEmpty = function () {
  
};

CreditCardForm.prototype.invalidFieldKeys = function () {
 
};

function onFieldValueChange(form, fieldKey) {
  
}

function onFieldFocusChange(form, field) {
  
}

function onCardTypeChange(form, field) {
  
}

function onEmptyChange(form, field) {
  
}

function onFieldStateChange(form, field) {
  
}

function splitDate(date) {
  
}

module.exports = {
    CreditCardForm: CreditCardForm
};