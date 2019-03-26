
var bus = require('framebus');
var createRestrictedInput = require('../../libs/create-restricted-input.js');
var constants = require('../../libs/constants');
var isIe9 = require('../../libs/is-ie9.js');
var toggler = require('../../libs/class-toggle.js');
var events = constants.events;
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
    this.render();
    
}

BaseInput.prototype.buildElement = function(){


    var type = this.type;

    var inputType = this.getConfiguration().type || 'tel';

    if(type === "pin") {
      
      inputType = 'password'
    }

    var element = document.createElement('input');

    /**
    * 1. For input element we want to
    * add a width of 100%
    * if the input field is a pan, we want to add a padding-right
    *
    *
    */
    element.style.width = "100%";

    console.log("checking the type at input element creation");
    if(type === "pan") {
        element.style.paddingRight = "55px";
    }

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

BaseInput.prototype.getConfiguration = function(){
  return this.model.conf.fields[this.type];
};

BaseInput.prototype.addDOMEventListeners = function(){
    this._addDOMFocusListeners();
    this._addDOMInputListeners();
    this._addDOMKeypressListeners();
};

/**
 * For any focus event, this.updateModel('isFocused', false|true);
 */
BaseInput.prototype._addDOMFocusListeners = function(){

  var element = this.element;

  if ('onfocusin' in document) {
    document.documentElement.addEventListener('focusin', function (event) {
      if (event.fromElement === element) { return; }
      if (event.relatedTarget) { return; }

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

BaseInput.prototype._addDOMKeypressListeners = function(){

    this.element.addEventListener('keypress', function (event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.model.emitEvent(this.type, 'inputSubmitRequest');
    }
  }.bind(this), false);

};

var validInput = function(value, type){
  if(value.length > 0) {
    var lastChar = value.charAt(value.length-1);
    if(type === "exp") {
      return (value.length === 3 && lastChar === '/') || !isNaN(lastChar);
    }
    else {
      return !isNaN(lastChar);
    }
  }
  return true;
};

BaseInput.prototype._addDOMInputListeners = function(){
    this.element.addEventListener(this._getDOMChangeEvent(), function () {
        var valueChanged = this.getUnformattedValue();
        
        if(!validInput(valueChanged, this.type)) {
          valueChanged = valueChanged.substring(0, valueChanged.length-1);
          this.formatter.setValue(valueChanged);
          return; 
        }
        
        if(this.type === "exp" && valueChanged && valueChanged.length > 0) {
          if(!this.hasSlash) {
            this.hasSlash = true;

            valueChanged = valueChanged.charAt(0) === '0' || valueChanged.charAt(0) === '1' ? valueChanged : "0"+valueChanged;
            
            if(valueChanged.length > 1) {
              valueChanged = valueChanged.substring(0, 2) + "/" + valueChanged.substring(2, valueChanged.length);
            }
            else {
              //
              this.hasSlash = false;
            }
            
          }
          else {
            
            if(valueChanged.length == 2){

              valueChanged = valueChanged.substring(0, 1);
              this.hasSlash = false;
            }

          }

          
          this.formatter.setValue(valueChanged);
        }

        if(this.type === "pan" && valueChanged && valueChanged.length > 3) {

          valueChanged = valueChanged.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
          
          this.formatter.setValue(valueChanged);
        }
        
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
   bus.on(events.TRIGGER_INPUT_FOCUS, function (type) {
     if (type === this.type) { this.element.focus(); }
   }.bind(this));

  bus.on(events.SET_PLACEHOLDER, this.setPlaceholder.bind(this));

   bus.on(events.ADD_CLASS, function (type, classname) {
     if (type === this.type) { toggle.add(this.element, classname); }
   }.bind(this));

   bus.on(events.REMOVE_CLASS, function (type, classname) {
     if (type === this.type) { toggle.remove(this.element, classname); }
   }.bind(this));

  bus.on(events.CLEAR_FIELD, function (type) {
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