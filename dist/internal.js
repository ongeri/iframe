(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function BaseInput(options) {

    this.type = options.type;

    this.model = options.model;

    this.element = this.buildElement();

    if (this.MAX_SIZE) {
        this.element.setAttribute('maxlength', this.MAX_SIZE);
    }
}

BaseInput.prototype.buildElement = function () {

    var type = this.type;

    var element = document.createElement('input');

    var placeHolder = "CVV";

    var name = "cvv";

    var attributes = {
        type: type,
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'none',
        spellcheck: 'false',
        'class': type,
        'data-interswitch-name': type,
        name: name,
        id: name
    };

    Object.keys(attributes).forEach(function (attr) {
        element.setAttribute(attr, attributes[attr]);
    });

    return element;
};

module.exports = {
    BaseInput: BaseInput
};

},{}],2:[function(require,module,exports){
"use strict";

var BaseInput = require('./base-input.js').BaseInput;
var MAX_SIZE = 4;

var cvvInput = function cvvInput(options) {

    this.MAX_SIZE = MAX_SIZE;

    console.log("cvv input");

    BaseInput.apply(this, arguments);
};

cvvInput.prototype = Object.create(BaseInput.prototype);
cvvInput.constructor = cvvInput;

module.exports = {
    CVVINPUT: cvvInput
};

},{"./base-input.js":1}],3:[function(require,module,exports){
'use strict';

var LabelComponent = require('./label.js');
var InputLabelComponent = require('./input-components.js').cvv;

var fieldComponent = function fieldComponent(options) {

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
    FieldComponent: fieldComponent
};

},{"./input-components.js":4,"./label.js":5}],4:[function(require,module,exports){
'use strict';

module.exports = {
    cvv: require('./cvv.js')
};

},{"./cvv.js":2}],5:[function(require,module,exports){
"use strict";

var label = function label(options) {

    this.element = document.createElement('label');

    this.element.setAttribute("for", options.name);

    this.element.innerHTML = options.label;
};

module.exports = label;

},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
    getFrameName: function getFrameName() {

        return window.name.replace('isw-hosted-field-', '');
    }

};

},{}],7:[function(require,module,exports){
'use strict';

var bus = require('framebus');
var CreditCardForm = require('./models/credit-card-form.js').CreditCardForm;
var packIframes = require('./pack-iframes.js');
var frameName = require('./get-frame-name.js');
var FieldComponent = require('./components/field-component.js').FieldComponent;
var create = function create() {

    console.log("created internal hosted fields ");

    bus.emit('FRAME_SET', {
        hello: "Is it me you are calling"
    }, builder);
};

var builder = function builder(conf) {
    console.log("calling builder");

    var cardForm = new CreditCardForm(conf);

    //pack iframes together
    var iframes = packIframes.packIframes(window.parent);

    iframes.forEach(function (frame) {
        frame.interswitch.hostedFields.initialize(cardForm);
    });

    bus.on("PAY_REQUEST", function (options, reply) {
        console.log("handled the pay request");

        var payHandler = createPayHandler(cardForm.getCardData());
    });
};

var createPayHandler = function createPayHandler(cardForm) {

    return function (options, reply) {

        var creditCardDetails = normalizeFields(cardForm.getCardData());
    };
};

var normalizeFields = function normalizeFields(options) {};

var initialize = function initialize(cardForm) {
    var fieldComponent;

    fieldComponent = new FieldComponent({
        model: cardForm,
        type: frameName.getFrameName()
    });

    document.body.appendChild(fieldComponent.element);
};

module.exports = {
    create: create,
    initialize: initialize
};

},{"./components/field-component.js":3,"./get-frame-name.js":6,"./models/credit-card-form.js":9,"./pack-iframes.js":11,"framebus":12}],8:[function(require,module,exports){
'use strict';

var hostedFields = require('./hosted-internal-fields.js');
window.interswitch = {
    hostedFields: hostedFields
};

},{"./hosted-internal-fields.js":7}],9:[function(require,module,exports){
'use strict';

var EventedModel = require('./evented-model');
var CreditCardForm = function CreditCardForm(conf) {
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
  this.on('change:possibleCardTypes', function () {
    this._validateField('cvv');
  }.bind(this));
  this.on('change:possibleCardTypes', onCardTypeChange(this, 'number'));

  //should add event listeners on each of the field :TODO
};

CreditCardForm.prototype = Object.create(EventedModel.prototype);
CreditCardForm.prototype.constructor = CreditCardForm;

/////////////////////////////////////////////////////////////
CreditCardForm.prototype._onNumberChange = function (number) {
  console.log("number change");
};

CreditCardForm.prototype._validateField = function (fieldKey) {};

CreditCardForm.prototype._validateCvv = function (value) {};

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

CreditCardForm.prototype.isEmpty = function () {};

CreditCardForm.prototype.invalidFieldKeys = function () {};

function onFieldValueChange(form, fieldKey) {}

function onFieldFocusChange(form, field) {}

function onCardTypeChange(form, field) {}

function onEmptyChange(form, field) {}

function onFieldStateChange(form, field) {}

function splitDate(date) {}

module.exports = {
  CreditCardForm: CreditCardForm
};

},{"./evented-model":10}],10:[function(require,module,exports){
"use strict";

var slice = Array.prototype.slice;

function EventedModel() {
  this._attributes = this.resetAttributes();
  this._listeners = {};
}

EventedModel.prototype.get = function get(compoundKey) {

  console.log("trying to get key " + compoundKey);
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
  console.log("returned " + traversal);
  return traversal;
};

EventedModel.prototype.set = function set(compoundKey, value) {
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
    this.emit('change');
    for (i = 1; i <= keys.length; i++) {
      key = keys.slice(0, i).join('.');
      this.emit('change:' + key, this.get(key));
    }
  }
};

EventedModel.prototype.on = function on(event, handler) {
  var listeners = this._listeners[event];

  if (!listeners) {
    this._listeners[event] = [handler];
  } else {
    listeners.push(handler);
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

},{}],11:[function(require,module,exports){
"use strict";

var packIframes = function packIframes(win) {
    var i, frame;
    var frames = [];
    console.log("frame length " + win.frames.length);
    console.log(win.frames[0].location.href + "----");
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

},{}],12:[function(require,module,exports){
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
},{}]},{},[8]);
