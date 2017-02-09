(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var types = {};
var VISA = 'visa';
var MASTERCARD = 'master-card';
var VERVE = 'verve';
var CVV = 'CVV';

var cardMap = [VISA, MASTERCARD];

types[VISA] = {
    common: 'Visa',
    type: VISA,
    prefixPattern: /^4$/,
    exactPattern: /^4\d*$/,
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: {
        name: CVV,
        size: 3
    }
};

types[MASTERCARD] = {
    common: 'MasterCard',
    type: MASTERCARD,
    prefixPattern: /^(5|5[1-5]|2|22|222|222[1-9]|2[3-6]|27[0-1]|2720)$/,
    exactPattern: /^(5[1-5]|222[1-9]|2[3-6]|27[0-1]|2720)\d*$/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
        name: CVV,
        size: 3
    }
};

var clone = function clone(x) {

    var exactPattern, prefixPattern, ret;
    if (!x) {
        return null;
    }

    exactPattern = x.exactPattern.source;
    prefixPattern = x.prefixPattern.source;
    ret = JSON.parse(JSON.stringify(x));
    ret.exactPattern = exactPattern;
    ret.prefixPattern = prefixPattern;

    return ret;
};

/**
 * Given a pan prefix value,
 * what type of card is this?
 */
var Card = function Card(val) {
    var type, value, i;
    var prefixResults = [];
    var exactResults = [];
    console.log("type of number " + (typeof val === 'undefined' ? 'undefined' : _typeof(val)));
    if (!(typeof val === 'string' || val instanceof String)) {
        return [];
    }

    for (i = 0; i < cardMap.length; i++) {
        type = cardMap[i];
        value = types[type];

        if (val.length === 0) {
            console.log("adding " + JSON.stringify(value));
            prefixResults.push(clone(value));
            continue;
        }

        if (value.exactPattern.test(val)) {
            exactResults.push(clone(value));
        } else if (value.prefixPattern.test(val)) {
            prefixResults.push(clone(value));
        }

        if (exactResults.length) {
            console.log("exact-res " + JSON.stringify(exactResults));
        } else {
            console.log("partial-res " + JSON.stringify(prefixResults));
        }
    }
    return exactResults.length ? exactResults : prefixResults;
};

module.exports = Card;

},{}],2:[function(require,module,exports){
'use strict';

module.exports = {
    cvv: require('./src/cvv.js'),
    pan: require('./src/pan.js'),
    pin: require('./src/pin.js')
};

},{"./src/cvv.js":3,"./src/pan.js":5,"./src/pin.js":6}],3:[function(require,module,exports){
'use strict';

var DEFAULT_MAX = 3;

var validation = function validation(isValid, isPotentiallyValid) {
    return {
        isValid: isValid,
        isPotentiallyValid: isPotentiallyValid
    };
};

var isMemberOf = function isMemberOf(value, arr) {

    var i = 0;

    for (; i < arr.length; i++) {
        if (arr[i] === value) return true;
    }
    return false;
};
var check = function check(value, maxlen) {
    maxlen = maxlen || DEFAULT_MAX;
    maxlen = maxlen instanceof Array ? maxlen : [maxlen];

    if (!(typeof value === 'string')) {
        //there is no way for it to be correct because it is
        //a string
        return validation(false, false);
    }
    if (!/^\d*$/.test(value)) {
        //it is not composed entirely of digits
        return validation(false, false);
    }
    if (isMemberOf(value.length, maxlen)) {
        //is a digit seq, is of the right length
        return validation(true, true);
    }
    if (value.length < Math.min.apply(null, maxlen)) {

        //even though not complete, have a good prefix
        return validation(false, true);
    }
    if (value.length > Math.max.apply(null, maxlen)) {

        //this is when the length is too long
        return validation(false, false);
    }

    //i find no other reason why you will be bad 
    return validation(true, true);
};

module.exports = check;

},{}],4:[function(require,module,exports){
/*
 * Luhn algorithm implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

function luhn10(identifier) {
  var sum = 0;
  var alt = false;
  var i = identifier.length - 1;
  var num;

  while (i >= 0) {
    num = parseInt(identifier.charAt(i), 10);

    if (alt) {
      num *= 2;
      if (num > 9) {
        num = num % 10 + 1; // eslint-disable-line no-extra-parens
      }
    }

    alt = !alt;

    sum += num;

    i--;
  }

  return sum % 10 === 0;
}

module.exports = luhn10;

},{}],5:[function(require,module,exports){
'use strict';

var getCardTypes = require('../../card-type');
var luhn = require('./luhn-10.js');

var verification = function verification(card, isPotentiallyValid, isValid) {
    return {
        card: card,
        isPotentiallyValid: isPotentiallyValid,
        isValid: isValid
    };
};
var Pan = function Pan(value) {

    var potentialTypes, cardType, isValid, i, maxLength;
    if (typeof value === 'number') {
        value = String(value);
    }

    if (typeof value !== 'string') {
        return verification(null, false, false);
    }

    //replace dashes or spaces with empty space
    value = value.replace(/\-|\s/g, '');

    //if not a number return
    if (!/^\d*$/.test(value)) {
        return verification(null, false, false);
    }

    potentialTypes = getCardTypes(value);

    if (potentialTypes.length === 0) {
        return verification(null, false, false);
    } else if (potentialTypes.length !== 1) {
        return verification(null, true, false);
    }

    console.log("potential types for " + value + " is " + JSON.stringify(potentialTypes));
    //there is just one card now
    cardType = potentialTypes[0];

    //do a luhn check
    isValid = luhn(value);

    maxLength = Math.max.apply(null, cardType.lengths);

    for (i = 0; i < cardType.lengths.length; i++) {
        if (cardType.lengths[i] === value.length) {
            isPotentiallyValid = value.length !== maxLength || isValid;
            return verification(cardType, isPotentiallyValid, isValid);
        }
    }

    return verification(cardType, value.length < maxLength, false);
};

module.exports = Pan;

},{"../../card-type":1,"./luhn-10.js":4}],6:[function(require,module,exports){
'use strict';

var verification = function verification(isPotentiallyValid, isValid) {
    return {
        isPotentiallyValid: isPotentiallyValid,
        isValid: isValid
    };
};

var Pin = function Pin(value) {

    if (typeof value === 'number') {
        value = String(number);
    }

    if (typeof value !== 'string') {
        return verification(false, false);
    }

    //replace dashes or spaces with empty space
    value = value.replace(/\s/g, '');

    //if not a number return
    if (!/^\d*$/.test(value)) {
        return verification(false, false);
    }

    if (value.length == 0) {
        return verification(false, false);
    }
    if (value.length < 4) {
        return verification(true, false);
    }

    return verification(true, true);
};

module.exports = Pin;

},{}],7:[function(require,module,exports){
"use strict";

module.exports = {

    READY: "READY",
    FRAME_SET: "FRAME_SET",
    INPUT_EVENT: "INPUT_EVENT",
    PAY_REQUEST: "PAY_REQUEST"
};

},{}],8:[function(require,module,exports){
"use strict";

var comp = function comp(a, b) {
    var aHash;

    if (a !== undefined && b === undefined) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    /**
     * {
     *  visa: true,
     *  mastercard: true,
     *  verve: true
     * }
     */
    aHash = a.reduce(function (accum, type) {
        accum[type.type] = true;
        return accum;
    }, {});

    return b.every(function (type) {
        return aHash.hasOwnProperty(type.type);
    });
};

module.exports = comp;

},{}],9:[function(require,module,exports){
'use strict';

var bus = require('framebus');
var createRestrictedInput = require('../../libs/create-restricted-input.js');
var constants = require('../../libs/constants');
var isIe9 = require('../../libs/is-ie9.js');
var toggler = require('../../libs/class-toggle.js');
var events = constants.events;
var ENTER_KEY_CODE = 13;
function BaseInput(options) {
  var shouldFormat;

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

  var type = this.type;

  var inputType = this.getConfiguration().type || 'tel';

  if (type === "pin") {

    inputType = 'password';
  }

  var element = document.createElement('input');

  var placeholder = this.getConfiguration().placeholder;

  var formMap = constants.formMap[type];

  var name = formMap.name;

  var attributes = {
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

  var element = this.element;

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

BaseInput.prototype._addDOMInputListeners = function () {
  this.element.addEventListener(this._getDOMChangeEvent(), function () {
    var valueChanged = this.getUnformattedValue();
    this.updateModel('value', valueChanged);
  }.bind(this), false);
};

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
  var eventPrefix = 'change:' + this.type;
  var self = this;

  this.model.on(eventPrefix + '.' + property, function () {
    callback.apply(self, arguments);
  });
};

BaseInput.prototype.render = function () {
  var modelData = this.model.get(this.type);
  var isValid = modelData.isValid;
  var isPotentiallyValid = modelData.isPotentiallyValid;

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

},{"../../libs/class-toggle.js":24,"../../libs/constants":25,"../../libs/create-restricted-input.js":26,"../../libs/is-ie9.js":28,"framebus":39}],10:[function(require,module,exports){
'use strict';

var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 3;

var cvvInput = function cvvInput(options) {

    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);
};

cvvInput.prototype = Object.create(BaseInput.prototype);
cvvInput.constructor = cvvInput;

module.exports = {
    CVVINPUT: cvvInput
};

},{"./base-input.js":9}],11:[function(require,module,exports){
'use strict';

var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 4;

var expInput = function expInput() {
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);
};

expInput.prototype = Object.create(BaseInput.prototype);
expInput.constructor = expInput;

module.exports = {
    EXP: expInput
};

},{"./base-input.js":9}],12:[function(require,module,exports){
'use strict';

var LabelComponent = require('./label.js');
var InputLabelComponent = require('./input-components.js');
var constants = require('../../libs/constants');

var fieldComponent = function fieldComponent(options) {

    var type = options.type;

    this.element = document.createDocumentFragment();

    var formMap = constants.formMap[type];

    this.element.appendChild(new LabelComponent(formMap).element);

    var inputElem = new InputLabelComponent[type]({
        model: options.model,
        type: type
    });

    this.element.appendChild(inputElem.element);
};
module.exports = {
    FieldComponent: fieldComponent
};

},{"../../libs/constants":25,"./input-components.js":13,"./label.js":14}],13:[function(require,module,exports){
'use strict';

module.exports = {
    cvv: require('./cvv.js').CVVINPUT,
    pan: require('./pan.js').PAN,
    pin: require('./pin.js').PIN,
    exp: require('./exp.js').EXP
};

},{"./cvv.js":10,"./exp.js":11,"./pan.js":15,"./pin.js":16}],14:[function(require,module,exports){
"use strict";

var label = function label(options) {

    this.element = document.createElement('label');

    this.element.setAttribute("for", options.name);

    this.element.innerHTML = options.label;
    console.log("what i passed " + options.name + " " + options.label);
};

module.exports = label;

},{}],15:[function(require,module,exports){
"use strict";

var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 16;

var panInput = function panInput() {
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);

    this.model.on("change:possibleCardTypes", function (possibleCardTypes) {}.bind(this));
};

panInput.prototype = Object.create(BaseInput.prototype);
panInput.constructor = panInput;

module.exports = {
    PAN: panInput
};

},{"./base-input.js":9}],16:[function(require,module,exports){
'use strict';

var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 4;

var pinInput = function pinInput() {
    this.MAX_SIZE = MAX_SIZE;

    BaseInput.apply(this, arguments);
};

pinInput.prototype = Object.create(BaseInput.prototype);
pinInput.constructor = pinInput;

module.exports = {
    PIN: pinInput
};

},{"./base-input.js":9}],17:[function(require,module,exports){
'use strict';

module.exports = {
    getFrameName: function getFrameName() {

        return window.name.replace('isw-hosted-field-', '');
    }

};

},{}],18:[function(require,module,exports){
'use strict';

var bus = require('framebus');
var CreditCardForm = require('./models/credit-card-form.js').CreditCardForm;
var packIframes = require('./pack-iframes.js');
var frameName = require('./get-frame-name.js');
var FieldComponent = require('./components/field-component.js').FieldComponent;
var events = require('../hosted-fields/events.js');
var request = require('../request');
var injectWithBlacklist = require('inject-stylesheet').injectWithBlacklist;

var create = function create() {

    bus.emit(events.FRAME_SET, {}, builder);
};

var builder = function builder(conf) {

    console.log("---> building started>>>");

    var client = conf.client;
    console.log("client object in builder " + JSON.stringify(conf));

    var cardForm = new CreditCardForm(conf);

    //pack iframes together
    var iframes = packIframes.packIframes(window.parent);

    iframes.forEach(function (frame) {
        frame.interswitch.hostedFields.initialize(cardForm);
    });

    bus.on(events.PAY_REQUEST, function (options, reply) {

        var payHandler = createPayHandler(client, cardForm);

        payHandler(options, reply);
    });
};

var createPayHandler = function createPayHandler(client, cardForm) {

    return function (options, reply) {

        var creditCardDetails = cardForm.getCardData();

        options = options || {};

        //post response
        console.log("credit card details is " + JSON.stringify(client));
        console.log(client);
        console.log(creditCardDetails);

        request({
            method: "POST",
            data: {
                creditCardDetails: creditCardDetails
            },
            url: "http://localhost:3000/api/v1/payment/hosted"
        }, function (err, res, status) {
            if (err) {
                console.log("error paying " + err);
                var obj = {
                    error: err
                };
                reply(obj);
                return;
            } else {
                console.log("response from server " + res.message);
                //bus.emit("PAY_DONE", {res});
                //bus.off("PAY_DONE");
                reply(res);
            }
        });
    };
};

var normalizeFields = function normalizeFields(options) {
    return;
};

var initialize = function initialize(cardForm) {
    var fieldComponent;

    var blacklist = ['background', 'display'];

    //inject merchant provided styles
    injectWithBlacklist(cardForm.conf.styles, blacklist);

    fieldComponent = new FieldComponent({
        model: cardForm,
        type: frameName.getFrameName()
    });

    //here a document is the one inside the frame
    document.body.appendChild(fieldComponent.element);
};

module.exports = {
    create: create,
    initialize: initialize
};

},{"../hosted-fields/events.js":7,"../request":34,"./components/field-component.js":12,"./get-frame-name.js":17,"./models/credit-card-form.js":21,"./pack-iframes.js":23,"framebus":39,"inject-stylesheet":40}],19:[function(require,module,exports){
'use strict';

var hostedFields = require('./hosted-internal-fields.js');
window.interswitch = {
    hostedFields: hostedFields
};

},{"./hosted-internal-fields.js":18}],20:[function(require,module,exports){
"use strict";

var obj = {
    pan: {
        value: "",
        isEmpty: true,
        isFocused: false,
        isValid: false,
        isPotentiallyValid: false
    },
    cvv: {
        value: "",
        isEmpty: true,
        isFocused: false,
        isValid: false,
        isPotentiallyValid: false
    },
    exp: {
        value: "",
        isEmpty: true,
        isFocused: false,
        isValid: false,
        isPotentiallyValid: false
    },
    pin: {
        value: "",
        isEmpty: true,
        isFocused: false,
        isValid: false,
        isPotentiallyValid: false
    }
};

module.exports = obj;

},{}],21:[function(require,module,exports){
'use strict';

var EventedModel = require('./evented-model');
var constants = require('../../libs/constants.js');
var externalEvents = constants.externalEvents;
var bus = require('framebus');
var validator = require('../../card-validator');
var CardDefault = require('./card-default.js');
var getCardTypes = require('../../card-type');
var comparePossibleCardTypes = require('../compare-card-type.js');

var CreditCardForm = function CreditCardForm(conf) {

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

    var onFieldChange = onFieldStateChange(this, field); //pass the entire form state to be processed

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
  this.on('change:possibleCardTypes', onCardTypeChange(this, 'pan'));

  //should add event listeners on each of the field :TODO
};

CreditCardForm.prototype = Object.create(EventedModel.prototype);
CreditCardForm.prototype.constructor = CreditCardForm;

CreditCardForm.prototype.emitEvent = function (fieldKey, eventType) {
  var cards;

  var possibleCardTypes = this.get('possibleCardTypes');
  var fields = this._fieldKeys.reduce(function (result, key) {
    console.log("iterating for key " + key);
    var fieldData = this.get(key);

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

  bus.emit("INPUT_EVENT", {
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

  var newPossibleCardTypes = getCardTypes(number.replace(/[-\s]/g, ''));
  var oldPossibleCardTypes = this.get('possibleCardTypes');

  if (!comparePossibleCardTypes(newPossibleCardTypes, oldPossibleCardTypes)) {
    this.set('possibleCardTypes', newPossibleCardTypes);
  }
};

CreditCardForm.prototype._validateField = function (fieldKey) {
  console.log("Validating fieldKey " + fieldKey);
  var validationResult;

  var value = this.get(fieldKey + '.value');
  var validate = validator[fieldKey];

  if (fieldKey === 'cvv') {
    console.log("on validating cvv ");
    validationResult = this._validateCvv(value);
    console.log(validationResult);
  } else if (fieldKey === 'expirationDate') {
    //validationResult = validate(splitDate(value));
  } else {
    //validate pan , pin
    validationResult = validate(value);
  }

  if (fieldKey === 'expirationMonth' || fieldKey === 'expirationYear') {
    //this._onSplitDateChange();
  } else {

    console.log("The validation resule::::::" + JSON.stringify(validationResult));
    this.set(fieldKey + '.isValid', validationResult.isValid);
    this.set(fieldKey + '.isPotentiallyValid', validationResult.isPotentiallyValid);
  }
};

CreditCardForm.prototype._validateCvv = function (value) {
  console.log("validating cvv");
  return validator.cvv(value, 3);
};

CreditCardForm.prototype.getCardData = function () {
  var expirationData;
  var result = {};
  var keys = [];

  console.log("keys are " + JSON.stringify(this._fieldKeys));

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

CreditCardForm.prototype.isEmpty = function () {};

CreditCardForm.prototype.invalidFieldKeys = function () {};

function onFieldValueChange(form, fieldKey) {

  return function () {
    var isEmpty = form.get(fieldKey + '.value');
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
    var event = form.get(field + '.isEmpty') ? externalEvents.EMPTY : externalEvents.NOT_EMPTY;
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
    console.log("firing validity change");
    form.emitEvent(field, externalEvents.VALIDITY_CHANGE);
  };
}

function splitDate(date) {}

module.exports = {
  CreditCardForm: CreditCardForm
};

},{"../../card-type":1,"../../card-validator":2,"../../libs/constants.js":25,"../compare-card-type.js":8,"./card-default.js":20,"./evented-model":22,"framebus":39}],22:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var slice = Array.prototype.slice;

function EventedModel() {
  this._attributes = this.resetAttributes();
  this._listeners = {};
}

EventedModel.prototype.initialize = function (obj) {

  if (!obj) {
    return;
  };

  var traversal = this._attributes;

  console.log(typeof obj === "undefined" ? "undefined" : _typeof(obj));

  for (var key in obj) {

    if (obj.hasOwnProperty(key)) {
      traversal[key] = obj[key];
    }
  }

  // console.log("object after initialization is "+JSON.stringify(traversal));
};

EventedModel.prototype.get = function get(compoundKey) {
  var i, key, keys;
  var traversal = this._attributes;

  if (compoundKey == null) {
    return traversal;
  }

  keys = compoundKey.split('.');

  for (i = 0; i < keys.length; i++) {
    key = keys[i];

    if (!traversal.hasOwnProperty(key)) {
      return undefined; // eslint-disable-line
    }

    traversal = traversal[key];
  }

  return traversal;
};

/**
 * Set the value to compound key
 * If there is a change, trigger two events 
 * one for the change in type and another for
 * a change of type:field
 */
EventedModel.prototype.set = function set(compoundKey, value) {
  console.log("Setting " + compoundKey + " " + value);
  var i, key, keys;
  var traversal = this._attributes;

  keys = compoundKey.split('.');

  for (i = 0; i < keys.length - 1; i++) {
    key = keys[i];

    if (!traversal.hasOwnProperty(key)) {
      traversal[key] = {};
    }

    traversal = traversal[key];
  }
  key = keys[i];

  if (traversal[key] !== value) {
    traversal[key] = value;
    //the value associated with this field has just changed
    //this.emit('change');

    for (i = 1; i <= keys.length; i++) {
      key = keys.slice(0, i).join('.');
      console.log('change:' + key + "----" + JSON.stringify(this.get(key)));
      this.emit('change:' + key, this.get(key));
    }
  }
};

EventedModel.prototype.on = function on(event, handler) {

  var listeners = this._listeners[event];

  if (!listeners) {
    this._listeners[event] = [handler];
  } else {
    this._listeners[event].push(handler);
  }
};

EventedModel.prototype.emit = function emit(event) {

  var i;
  var self = this;
  var args = arguments;

  var listeners = this._listeners[event];

  if (!listeners) {
    return;
  }

  for (i = 0; i < listeners.length; i++) {
    listeners[i].apply(self, slice.call(args, 1));
  }
};

EventedModel.prototype.resetAttributes = function resetAttributes() {
  return {};
};

module.exports = EventedModel;

},{}],23:[function(require,module,exports){
"use strict";

var packIframes = function packIframes(win) {
    var i, frame;
    var frames = [];
    console.log(document.referrer);
    console.log(win.frames[0].location.href + "----" + win.frames[1].location.href);
    for (i = 0; i < win.frames.length; i++) {
        frame = win.frames[i];

        try {

            frames.push(frame);
        } catch (e) {
            //ignore exp
            console.log("exception " + e);
        }
    }
    return frames;
};

module.exports = {
    packIframes: packIframes
};

},{}],24:[function(require,module,exports){
'use strict';

/**
 * element is HTML element
 * @returns array of classlist,
 * if the element does not exist,
 * return an empty array
 */
var _classOf = function _classOf(element) {
    if (element) {
        return element.className.trim().split('/\s+/');
    }

    return [];
};

var add = function add(element) {

    var toAdd = Array.prototype.slice.call(arguments, 1);

    console.log("adding class " + toAdd);

    var className = _classOf(element).filter(function (c) {
        return toAdd.indexOf(c) === -1;
    }).concat(toAdd).join(' ');

    console.log("final class name " + className);
    element.className = className;
};

var remove = function remove(element) {

    var toAdd = Array.prototype.slice.call(arguments, 1);

    var className = _classOf(element).filter(function (c) {
        return toAdd.indexOf(c) === -1;
    }).join(' ');

    element.className = className;
};

var toggle = function toggle(element, className, adding) {

    if (adding) {
        add(element, className);
    } else {
        remove(element, className);
    }
};

module.exports = {
    add: add,
    remove: remove,
    toggle: toggle
};

},{}],25:[function(require,module,exports){
'use strict';

var constants = {

  externalEvents: {
    FOCUS: 'focus',
    BLUR: 'blur',
    EMPTY: 'empty',
    NOT_EMPTY: 'notEmpty',
    VALIDITY_CHANGE: 'validityChange',
    CARD_TYPE_CHANGE: 'cardTypeChange'
  },

  events: {
    TRIGGER_INPUT_FOCUS: 'TRIGGER_INPUT_FOCUS',
    SET_PLACEHOLDER: 'SET_PLACEHOLDER',
    ADD_CLASS: 'ADD_CLASS',
    REMOVE_CLASS: 'REMOVE_CLASS',
    CLEAR_FIELD: 'CLEAR_FIELD'
  },

  DEFAULTIFRAMESTYLE: {
    border: 'none',
    width: '100%',
    height: '100%',
    'float': 'left'
  },
  formMap: {
    pan: {
      name: "Pan",
      label: "PAN"
    },
    cvv: {
      name: "cvv",
      label: "CVV"
    },
    pin: {
      name: "pin",
      label: "PIN"
    },
    exp: {
      name: "expiration",
      label: "Expiration Date"
    },
    expMonth: {
      name: "expirationMonth",
      label: "Expiration Month"
    },
    expYear: {
      name: "expirationYear",
      label: "Expiration Year"
    }

  }

};

module.exports = constants;

},{}],26:[function(require,module,exports){
'use strict';

var FakeRestrictedInput = require('./fake-restricted-input');
module.exports = function (options) {

    var shouldFormat = options.shouldFormat;

    return new FakeRestrictedInput(options);
};

},{"./fake-restricted-input":27}],27:[function(require,module,exports){
"use strict";

function FakeRestrictedInput(options) {
  this.inputElement = options.element;
}

FakeRestrictedInput.prototype.getUnformattedValue = function () {
  return this.inputElement.value;
};

FakeRestrictedInput.prototype.setPattern = function () {};

module.exports = FakeRestrictedInput;

},{}],28:[function(require,module,exports){
'use strict';

module.exports = function isIe9(userAgent) {
  userAgent = userAgent || navigator.userAgent;
  return userAgent.indexOf('MSIE 9') !== -1;
};

},{}],29:[function(require,module,exports){
"use strict";

module.exports = function (fn) {
    var called = false;
    return function () {
        if (!called) {
            called = true;
            fn.apply(null, arguments);
        }
    };
};

},{}],30:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var querify = function querify(url, params) {

    url = url || '';

    if (params != null && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' && _notEmpty(params)) {
        url += url.indexOf("?") === -1 ? "?" : "";
        url += url.indexOf("=") !== -1 ? "&" : "";
        url += stringify(params);
    }

    return url;
};

//recursive DFS on a json string with O(N) memory
// O(N+M) time processing function. Fast enough
var stringify = function stringify(obj, namespace) {
    var k, v, p;
    var query = [];

    for (p in obj) {

        if (!obj.hasOwnProperty(p)) {
            continue;
        }

        v = obj[p];

        if (namespace) {

            //if array, change k
            if (_isArray(obj)) {
                k = namespace + '[]';
            }
            //else obj so change k
            else {
                    k = namespace + '[' + p + ']';
                }
        } else {
            k = p;
        }

        if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
            query.push(stringify(v, k));
        } else {
            query.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    console.log("final query " + query.join("&"));
    return query.join("&");
};

var _isArray = function _isArray(value) {

    return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.length === 'number' && Object.prototype.toString.call(value) === '[object Array]' || false;
};

/**
 * checks if an object is non empty
 */
var _notEmpty = function _notEmpty(obj) {
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
};

module.exports = {
    querify: querify,
    stringify: stringify
};

},{}],31:[function(require,module,exports){
'use strict';

/**
 * Please read  rfc4122
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}],32:[function(require,module,exports){
(function (global){
'use strict';

var queryString = require('../libs/query-string.js');
var isXHRAvailable = global.XMLHttpRequest && 'withCredentials' in new global.XMLHttpRequest();
var parseBody = require('./parse-body.js');
var prepBody = require('./prep-body.js');
var getRequestObject = function getRequestObject() {
    return isXHRAvailable ? new XMLHttpRequest() : new XDomainRequest();
};
var request = function request(options, cb) {
    console.log("XHR enabled ? " + isXHRAvailable);
    var status, resBody;

    var method = options.method;
    var url = options.url;
    var body = options.data;
    var timeout = options.timeout;
    var headers = options.headers || {};
    var req = getRequestObject();
    var callback = cb;

    console.log("Request method: " + method);
    console.log("url is: " + url);

    if (method === "GET") {
        url = queryString.querify(url, body);
        body = null;
    }

    //set up event listeners for XHR
    if (isXHRAvailable) {

        req.onreadystatechange = function () {

            if (req.readyState !== XMLHttpRequest.DONE) {
                //this should evaluate to 4
                //request is not complete
                return;
            }

            status = req.status;
            resBody = parseBody(req.responseText);

            if (status >= 400 || status < 200) {
                //non-200
                console.log("an error occured in http request " + status);
                callback(resBody || 'error', null, status || 500);
            } else {
                console.log(" a good response came back");
                callback(null, resBody, status);
            }
        };
    } else {
        //set up listeners for XDR
        req.onload = function () {
            callback(null, parseBody(req.responseText), req.status);
        };
        req.onerror = function () {
            callback('error', null, 500);
        };
        req.onprogress = function () {
            //do nothing
        };
        req.ontimeout = function () {
            callback('timeout', null, -1); //
        };
    }

    //open the socket asyncly
    req.open(method, url, true);
    req.timeout = timeout;

    //set the headers one last time
    if (isXHRAvailable) {
        req.setRequestHeader("Content-Type", "application/json");
        // TODO: Make this work in IE9.
        //
        // To do this, we'll change these URL and headers...
        // /api/v1
        // Content-Type: text/xml
        // Authorization: Bearer 123456
        //
        // ...to this URL:
        // /my/endpoint?content_type=text%2Fxml&authorization:Bearer+123456

        Object.keys(headers).forEach(function (headerKey) {
            req.setRequestHeader(headerKey, headers[headerKey]);
        });
    }

    try {
        //body should be a string
        req.send(prepBody(method, body));
    } catch (e) {
        //do nothing
    }
}; //end of request method


module.exports = {
    request: request,
    queryString: queryString
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../libs/query-string.js":30,"./parse-body.js":37,"./prep-body.js":38}],33:[function(require,module,exports){
(function (global){
"use strict";

module.exports = function () {
    return global.navigator.userAgent;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],34:[function(require,module,exports){
(function (global){
'use strict';

var once = require('../libs/once.js');
var isHTTP = require('./is-http.js');
var getUserAgent = require('./get-user-agent.js');
var AjaxDriver = require('./ajax-driver.js');
var JSONPDriver = require('./jsonp-driver.js');
var ajaxIsAvailable;

var ajaxAvailable = function ajaxAvailable() {

    if (ajaxIsAvailable == null) {
        console.log(global.navigator.userAgent);
        ajaxIsAvailable = !(isHTTP() && /MSIE\s(8|9)/.test(getUserAgent()));
    }

    return ajaxIsAvailable;
};
module.exports = function (options, callback) {

    callback = once(callback);
    options.method = (options.method || 'GET').toUpperCase();
    options.timeout = options.timeout == null ? 60000 : options.timeout;
    options.data = options.data || {};

    if (ajaxAvailable()) {
        //IE more likely
        console.log("normal browser or IE");
        // var root = {
        //     name: {
        //         first: "arthur",
        //         last: "okeke"
        //     },
        //     age: [1,2,3]
        // };
        // //AjaxDriver.request(options, callback);
        // var out = AjaxDriver.queryString.stringify(root);
        //console.log(out);

        // var conf = {
        //     method: "GET",
        //     timeout: "5000",
        //     data: "",
        //     url:"http://localhost:3000/status"
        // };

        // JSONPDriver.request(conf, function(err, res, status){
        //     if(err) {
        //         console.log("error "+JSON.stringify(err));
        //     }else {
        //         console.log(status);
        //         console.log(res);
        //     }
        // });
        AjaxDriver.request(options, callback);
    } else {
        //use jsondriver
        console.log("use jsonp");
        JSONPDriver.request(options, callback);
    }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../libs/once.js":29,"./ajax-driver.js":32,"./get-user-agent.js":33,"./is-http.js":35,"./jsonp-driver.js":36}],35:[function(require,module,exports){
(function (global){
"use strict";

module.exports = function () {
    return global.location.protocol === "http:";
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],36:[function(require,module,exports){
(function (global){
'use strict';

var queryString = require('../libs/query-string.js');
var uuid = require('../libs/uuid.js');
var timeouts = {};
var head;
var request = function request(options, callback) {

    var script;
    var callbackName = 'callback_json_' + uuid().replace(/-/g, '');
    var url = options.url;
    var attrs = options.data;
    var method = options.method;
    var timeout = options.timeout;

    url = queryString.querify(url, attrs);
    console.log("url after firs call " + url);
    url = queryString.querify(url, {
        _method: method,
        callback: callbackName
    });

    console.log("url for jsonp is " + url);

    script = _createScriptTag(url, callbackName);
    console.log("script tag created " + JSON.stringify(script));
    _setupGlobalCallback(script, callback, callbackName);
    _setupTimeout(timeout, callbackName);

    if (!head) {
        head = document.getElementsByTagName('head')[0];
    }
    console.log("the head element " + JSON.stringify(head) + " " + JSON.stringify(head.childNodes));
    head.appendChild(script);
};

var _createScriptTag = function _createScriptTag(url, callbackName) {

    var script = document.createElement('script');

    var done = false;

    script.src = url;
    script.async = true;
    script.type = "text/javascript";

    script.onerror = function () {
        global[callbackName]({ message: 'error', status: 500 });
    };

    script.onload = script.onreadstatechange = function () {
        if (done) return;

        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
            done = true;
            script.onload = script.onreadstatechange = null;
        }
    };

    return script;
};
var _setupGlobalCallback = function _setupGlobalCallback(script, callback, callbackName) {

    global[callbackName] = function (response) {
        var status = response.status || 500;
        var err = null;
        var data = null;

        console.log("response is back " + status);

        delete response.status;

        if (status >= 400 || status < 200) {
            err = response;
        } else {
            data = response;
        }

        _cleanupGlobal(callbackName);

        _removeScript(script);

        clearTimeout(timeouts[callbackName]);

        callback(err, data, status);
    };
};
var _setupTimeout = function _setupTimeout(timeout, callbackName) {

    timeouts[callbackName] = setTimeout(function () {
        console.log("times out");
        timeouts[callbackName] = null;

        global[callbackName]({
            error: 'timeout',
            status: -1
        });

        /**
         * when there is a timeout,
         * this key will be cleaned
         * so re-assign it
         * and eventually cleapup again afterwards
         */
        global[callbackName] = function () {
            _cleanupGlobal(callbackName);
        };
    }, timeout);
};

var _cleanupGlobal = function _cleanupGlobal(callbackName) {
    try {
        delete global[callbackName];
    } catch (e) {
        global[callbackName] = null;
    }
};

var _removeScript = function _removeScript(script) {
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
};

module.exports = {
    request: request
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../libs/query-string.js":30,"../libs/uuid.js":31}],37:[function(require,module,exports){
"use strict";

/**
 * assumes body is a json string
 */
module.exports = function (body) {
    try {
        body = JSON.parse(body);
    } catch (e) {}

    return body;
};

},{}],38:[function(require,module,exports){
'use strict';

module.exports = function (method, body) {

    if (typeof method !== 'string') {
        throw new Error("method must be a string");
    }
    if (method.toLowerCase() !== 'get' && body != null) {
        body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    return body;
};

},{}],39:[function(require,module,exports){
(function (global){
'use strict';
(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(typeof global === 'undefined' ? root : global);
  } else if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else {
    root.framebus = factory(root);
  }
})(this, function (root) { // eslint-disable-line no-invalid-this
  var win, framebus;
  var popups = [];
  var subscribers = {};
  var prefix = '/*framebus*/';

  function include(popup) {
    if (popup == null) { return false; }
    if (popup.Window == null) { return false; }
    if (popup.constructor !== popup.Window) { return false; }

    popups.push(popup);
    return true;
  }

  function target(origin) {
    var key;
    var targetedFramebus = {};

    for (key in framebus) {
      if (!framebus.hasOwnProperty(key)) { continue; }

      targetedFramebus[key] = framebus[key];
    }

    targetedFramebus._origin = origin || '*';

    return targetedFramebus;
  }

  function publish(event) {
    var payload, args;
    var origin = _getOrigin(this); // eslint-disable-line no-invalid-this

    if (_isntString(event)) { return false; }
    if (_isntString(origin)) { return false; }

    args = Array.prototype.slice.call(arguments, 1);

    payload = _packagePayload(event, args, origin);
    if (payload === false) { return false; }

    _broadcast(win.top, payload, origin);

    return true;
  }

  function subscribe(event, fn) {
    var origin = _getOrigin(this); // eslint-disable-line no-invalid-this

    if (_subscriptionArgsInvalid(event, fn, origin)) { return false; }

    subscribers[origin] = subscribers[origin] || {};
    subscribers[origin][event] = subscribers[origin][event] || [];
    subscribers[origin][event].push(fn);

    return true;
  }

  function unsubscribe(event, fn) {
    var i, subscriberList;
    var origin = _getOrigin(this); // eslint-disable-line no-invalid-this

    if (_subscriptionArgsInvalid(event, fn, origin)) { return false; }

    subscriberList = subscribers[origin] && subscribers[origin][event];
    if (!subscriberList) { return false; }

    for (i = 0; i < subscriberList.length; i++) {
      if (subscriberList[i] === fn) {
        subscriberList.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  function _getOrigin(scope) {
    return scope && scope._origin || '*';
  }

  function _isntString(string) {
    return typeof string !== 'string';
  }

  function _packagePayload(event, args, origin) {
    var packaged = false;
    var payload = {
      event: event,
      origin: origin
    };
    var reply = args[args.length - 1];

    if (typeof reply === 'function') {
      payload.reply = _subscribeReplier(reply, origin);
      args = args.slice(0, -1);
    }

    payload.args = args;

    try {
      packaged = prefix + JSON.stringify(payload);
    } catch (e) {
      throw new Error('Could not stringify event: ' + e.message);
    }
    return packaged;
  }

  function _unpackPayload(e) {
    var payload, replyOrigin, replySource, replyEvent;

    if (e.data.slice(0, prefix.length) !== prefix) { return false; }

    try {
      payload = JSON.parse(e.data.slice(prefix.length));
    } catch (err) {
      return false;
    }

    if (payload.reply != null) {
      replyOrigin = e.origin;
      replySource = e.source;
      replyEvent = payload.reply;

      payload.reply = function reply(data) { // eslint-disable-line consistent-return
        var replyPayload = _packagePayload(replyEvent, [data], replyOrigin);

        if (replyPayload === false) { return false; }

        replySource.postMessage(replyPayload, replyOrigin);
      };

      payload.args.push(payload.reply);
    }

    return payload;
  }

  function _attach(w) {
    if (win) { return; }
    win = w || root;

    if (win.addEventListener) {
      win.addEventListener('message', _onmessage, false);
    } else if (win.attachEvent) {
      win.attachEvent('onmessage', _onmessage);
    } else if (win.onmessage === null) {
      win.onmessage = _onmessage;
    } else {
      win = null;
    }
  }

  function _uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;

      return v.toString(16);
    });
  }

  function _onmessage(e) {
    var payload;

    if (_isntString(e.data)) { return; }

    payload = _unpackPayload(e);
    if (!payload) { return; }

    _dispatch('*', payload.event, payload.args, e);
    _dispatch(e.origin, payload.event, payload.args, e);
    _broadcastPopups(e.data, payload.origin, e.source);
  }

  function _dispatch(origin, event, args, e) {
    var i;

    if (!subscribers[origin]) { return; }
    if (!subscribers[origin][event]) { return; }

    for (i = 0; i < subscribers[origin][event].length; i++) {
      subscribers[origin][event][i].apply(e, args);
    }
  }

  function _hasOpener(frame) {
    if (frame.top !== frame) { return false; }
    if (frame.opener == null) { return false; }
    if (frame.opener === frame) { return false; }
    if (frame.opener.closed === true) { return false; }

    return true;
  }

  function _broadcast(frame, payload, origin) {
    var i;

    try {
      frame.postMessage(payload, origin);

      if (_hasOpener(frame)) {
        _broadcast(frame.opener.top, payload, origin);
      }

      for (i = 0; i < frame.frames.length; i++) {
        _broadcast(frame.frames[i], payload, origin);
      }
    } catch (_) { /* ignored */ }
  }

  function _broadcastPopups(payload, origin, source) {
    var i, popup;

    for (i = popups.length - 1; i >= 0; i--) {
      popup = popups[i];

      if (popup.closed === true) {
        popups = popups.slice(i, 1);
      } else if (source !== popup) {
        _broadcast(popup.top, payload, origin);
      }
    }
  }

  function _subscribeReplier(fn, origin) {
    var uuid = _uuid();

    function replier(d, o) {
      fn(d, o);
      framebus.target(origin).unsubscribe(uuid, replier);
    }

    framebus.target(origin).subscribe(uuid, replier);
    return uuid;
  }

  function _subscriptionArgsInvalid(event, fn, origin) {
    if (_isntString(event)) { return true; }
    if (typeof fn !== 'function') { return true; }
    if (_isntString(origin)) { return true; }

    return false;
  }

  _attach();

  framebus = {
    target: target,
    include: include,
    publish: publish,
    pub: publish,
    trigger: publish,
    emit: publish,
    subscribe: subscribe,
    sub: subscribe,
    on: subscribe,
    unsubscribe: unsubscribe,
    unsub: unsubscribe,
    off: unsubscribe
  };

  return framebus;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],40:[function(require,module,exports){
'use strict';

var injectStylesheet = require('./lib/inject-stylesheet');

module.exports = {
  injectWithWhitelist: function (styles, list) { return injectStylesheet(styles, list, true); },
  injectWithBlacklist: function (styles, list) { return injectStylesheet(styles, list, false); }
};

},{"./lib/inject-stylesheet":43}],41:[function(require,module,exports){
'use strict';

module.exports = function filterStyleKeys(styleObject, propertyList, isWhitelist) {
  var result = {};

  function whitelistFilter(key) {
    if (propertyList.indexOf(key) !== -1) {
      result[key] = styleObject[key];
    }
  }

  function blacklistFilter(key) {
    if (propertyList.indexOf(key) === -1) {
      result[key] = styleObject[key];
    }
  }

  if (isWhitelist) {
    Object.keys(styleObject).forEach(whitelistFilter);
  } else {
    Object.keys(styleObject).forEach(blacklistFilter);
  }

  return result;
};

},{}],42:[function(require,module,exports){
/**
 * CSS attack vectors: (please add if you find more)
 *
 * - IE 5, 6, and 7 support computed properties via injecting JS with expression().
 * - JS can be executed in place of a url():
 *   -  backround-color: "javascript:alert(1)"
 * - CSRF is possible using the url() function.
 * - The -moz-binding property for attaching XBL requires a URL.
 *
 * Resources:
 * - https://code.google.com/p/google-caja/wiki/CssAllowsArbitraryCodeExecution
 * - https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.234_-_CSS_Escape_And_Strictly_Validate_Before_Inserting_Untrusted_Data_into_HTML_Style_Property_Values
 */

'use strict';

var valueFilters = [
  /;/,
  /@import/i,
  /expression/i,
  /url/i,
  /javascript/i
];

function htmlEscape(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function filterStyleValues(dirty) {
  var clean = {};

  dirty = dirty || {};

  Object.keys(dirty).forEach(function (key) {
    var value = dirty[key];
    var unsanitary = valueFilters.some(function (regex) {
      return regex.test(value);
    });

    if (unsanitary) { return; }

    clean[key] = htmlEscape(dirty[key]);
  });

  return clean;
}

module.exports = filterStyleValues;

},{}],43:[function(require,module,exports){
'use strict';

var validateSelector = require('./validate-selector');
var filterStyleKeys = require('./filter-style-keys');
var filterStyleValues = require('./filter-style-values');

function isSelectorMediaQuery(selector) {
  return /^@media\s+/i.test(selector);
}

function buildRule(selector, styles, curriedKeysFilter) {
  var result, sanitized;
  var constructedRule = selector + '{';

  styles = styles || {};

  if (isSelectorMediaQuery(selector)) {
    Object.keys(styles).forEach(function (innerSelector) {
      if (!validateSelector(innerSelector)) { return; }

      constructedRule += buildRule(innerSelector, styles[innerSelector], curriedKeysFilter);
    });
  } else {
    result = curriedKeysFilter(styles);
    sanitized = filterStyleValues(result);

    Object.keys(sanitized).forEach(function (rule) {
      constructedRule += rule + ':' + sanitized[rule] + ';';
    });
  }

  constructedRule += '}';
  return constructedRule;
}

function injectStylesheet(styles, propertyList, isWhitelist) {
  var stylesheet;
  var position = 0;
  var styleElement = document.createElement('style');

  document.querySelector('head').appendChild(styleElement);
  stylesheet = styleElement.sheet || styleElement.styleSheet;

  styles = styles || {};
  propertyList = propertyList || [];

  function curriedKeysFilter(styleObject) {
    return filterStyleKeys(styleObject, propertyList, isWhitelist);
  }

  Object.keys(styles).forEach(function (selector) {
    var constructedRule;

    if (!validateSelector(selector)) { return; }

    constructedRule = buildRule(selector, styles[selector], curriedKeysFilter);

    try {
      if (stylesheet.insertRule) {
        stylesheet.insertRule(constructedRule, position);
      } else {
        stylesheet.addRule(selector, constructedRule.replace(/^[^{]+/, '').replace(/{|}/g, ''), position);
      }
      position++;
    } catch (err) {
      if (!err instanceof SyntaxError) { throw err; }
    }
  });

  return styleElement;
}

module.exports = injectStylesheet;

},{"./filter-style-keys":41,"./filter-style-values":42,"./validate-selector":44}],44:[function(require,module,exports){
'use strict';

function validateSelector(selector) {
  if (selector.trim().length === 0) { return false; }
  if (/supports/i.test(selector)) { return false; }
  if (/import/i.test(selector)) { return false; }
  if (/\{|\}/.test(selector)) { return false; }
  if (/</.test(selector)) { return false; }

  return true;
}

module.exports = validateSelector;

},{}]},{},[19]);
