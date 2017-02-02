
var EventedModel = require('./evented-model');
var constants = require('../../libs/constants.js');
var externalEvents = constants.externalEvents;
var bus = require('framebus');

var CreditCardForm = function(conf){
    

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

    console.log("Keys for fields "+JSON.stringify(this._fieldKeys)+">>>");

    EventedModel.apply(this, arguments);

    this.conf = conf;

    /** 
     * 
     * iterate over all the fields
     * for example 
     * ["cvv", "pan"]
     * 
     */

    this._fieldKeys.forEach(function(field){

      var onFieldChange = onFieldStateChange(this, field);//pass the entire form state to be processed

      this.on('change:' + field + '.value', onFieldValueChange(this, field));

    }.bind(this));

    this.on('change:number.value', this._onNumberChange);
    

    //should add event listeners on each of the field :TODO
};

CreditCardForm.prototype = Object.create(EventedModel.prototype);
CreditCardForm.prototype.constructor = CreditCardForm;


CreditCardForm.prototype.emitEvent = function(fieldKey, eventType){
  
  
  var fields = this._fieldKeys.reduce(function (result, key) {
    var fieldData = this.get(key);

    result[key] = {
      
    };
    return result;
  }.bind(this), {});

  

  bus.emit("INPUT_EVENT", {
    merchantPayload: {
      emittedBy: fieldKey,
      fields: fields
    },
    type: eventType
  });
};
/////////////////////////////////////////////////////////////
CreditCardForm.prototype._onNumberChange = function (number) {
  console.log("number change");
};

CreditCardForm.prototype._validateField = function (fieldKey) {

  var validationResult;
  var value = this.get(fieldKey + '.value');

  if (fieldKey === 'cardCVV') {
    validationResult = this._validateCvv(value);
  } else if (fieldKey === 'expirationDate') {
    //validationResult = validate(splitDate(value));
  } else {
    //validationResult = validate(value);
  }

  if (fieldKey === 'expirationMonth' || fieldKey === 'expirationYear') {
    //this._onSplitDateChange();
  } else {
    //this.set(fieldKey + '.isValid', validationResult.isValid);
    //this.set(fieldKey + '.isPotentiallyValid', validationResult.isPotentiallyValid);
  }
};

CreditCardForm.prototype._validateCvv = function (value) {
  return true;//defer implementation
};

CreditCardForm.prototype.getCardData = function () {
  var expirationData;
  var result = {};
  var keys = [];

  console.log("keys are "+JSON.stringify(this._fieldKeys));

  if (this._fieldKeys.indexOf('pan') !== -1) {
    keys.push('pan');
  }

  if (this._fieldKeys.indexOf('cvv') !== -1) {
    keys.push('cvv');
  }

  if (this._fieldKeys.indexOf('postalCode') !== -1) {
    keys.push('postalCode');
  }

  if (this._fieldKeys.indexOf('exp') !== -1) {
    keys.push('exp');
  }

  if (this._fieldKeys.indexOf('pin') !== -1) {
    keys.push('pin');
  }

  

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
  
};

CreditCardForm.prototype.invalidFieldKeys = function () {
 
};

function onFieldValueChange(form, fieldKey) {
  
   return function () {
    var isEmpty =  form.get(fieldKey + '.value');
    //console.log("isEmpty is "+isEmpty+" ");
    form.set(fieldKey + '.isEmpty', isEmpty === '');
    //form._validateField(fieldKey);
  };


}

function onFieldFocusChange(form, field) {
  
}

function onCardTypeChange(form, field) {
  
}

function onEmptyChange(form, field) {
  
}

/**
 * returns a function value for when there is a state change
 * @param form: credit-card-form
 * @param field: string
 */
function onFieldStateChange(form, field) {
  return function(){
    form.emitEvent(field, externalEvents.VALIDITY_CHANGE);
  };
}

function splitDate(date) {
  
}

module.exports = {
    CreditCardForm: CreditCardForm
};