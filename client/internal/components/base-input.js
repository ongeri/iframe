
function BaseInput(options){

    this.type = options.type;

    this.model = options.model;

    this.element = this.buildElement();

    if(this.MAX_SIZE) {
        this.element.setAttribute('maxlength', this.MAX_SIZE);
    }
    
}

BaseInput.prototype.buildElement = function(){


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
    BaseInput : BaseInput
}