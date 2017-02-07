
var bus = require('framebus');
var createRestrictedInput = require('../../libs/create-restricted-input.js');
var constants = require('../../libs/constants');
var isIe9 = require('../../libs/is-ie9.js');
var toggler = require('../../libs/class-toggle.js');
var ENTER_KEY_CODE = 13;
function BaseInput(options){
    var shouldFormat;

    this.type = options.type;

    this.model = options.model;

    this.element = this.buildElement();

    if(this.MAX_SIZE) {
        this.element.setAttribute('maxlength', this.MAX_SIZE);
    }
    shouldFormat = this.getConfiguration().formatInput !== false && this.element instanceof HTMLInputElement;
    console.log("shouldFormat "+shouldFormat);
    this.formatter = createRestrictedInput({
        shouldFormat: false,
        element: this.element,
        pattern: ' '
    });

    this.addDOMEventListeners();
    this.addModelEventListeners();
    this.addBusEventListeners();
    //this.render();
    
}

BaseInput.prototype.buildElement = function(){


    var type = this.type;

    var inputType = this.getConfiguration().type || 'tel';

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

  console.log("primitive attrs "+JSON.stringify(attributes));

  Object.keys(attributes).forEach(function (attr) {
    element.setAttribute(attr, attributes[attr]);
  });

  return element;

};

BaseInput.prototype.getConfiguration = function(){
  return this.model.conf.fields[this.type];
};

BaseInput.prototype.addDOMEventListeners = function(){
    this._addDOMInputListeners();
    this._addDOMKeypressListeners();
};

BaseInput.prototype._addDOMKeypressListeners = function(){

    this.element.addEventListener('keypress', function (event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.model.emitEvent(this.type, 'inputSubmitRequest');
    }
  }.bind(this), false);

};

BaseInput.prototype._addDOMInputListeners = function(){
    this.element.addEventListener(this._getDOMChangeEvent(), function () {
        var valueChanged = this.getUnformattedValue();
        this.updateModel('value', valueChanged);
    }.bind(this), false);
};

BaseInput.prototype._getDOMChangeEvent = function(){
    return isIe9() ? 'keyup' : 'input';
};

BaseInput.prototype.updateModel = function(key, value){
  this.model.set(this.type + '.' + key, value);   
};

BaseInput.prototype.getUnformattedValue = function(){
    return this.formatter.getUnformattedValue();
};

BaseInput.prototype.addModelEventListeners = function(){
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
//   bus.on(events.TRIGGER_INPUT_FOCUS, function (type) {
//     if (type === this.type) { this.element.focus(); }
//   }.bind(this));

  bus.on("SET_PLACEHOLDER", this.setPlaceholder.bind(this));

//   bus.on(events.ADD_CLASS, function (type, classname) {
//     if (type === this.type) { classlist.add(this.element, classname); }
//   }.bind(this));

//   global.bus.on(events.REMOVE_CLASS, function (type, classname) {
//     if (type === this.type) { classlist.remove(this.element, classname); }
//   }.bind(this));

  bus.on("CLEAR_FIELD", function (type) {
    if (type === this.type) {
      this.element.value = '';
      this.updateModel('value', '');
    }
  }.bind(this));

};

BaseInput.prototype.setPlaceholder = function (type, placeholder) {
  if (type === this.type) { this.element.setAttribute('placeholder', placeholder); }
};

module.exports = {
    BaseInput : BaseInput
}