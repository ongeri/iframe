var  bus = require('framebus');
var CreditCardForm = require('./models/credit-card-form.js').CreditCardForm;
var packIframes = require('./pack-iframes.js');
var frameName = require('./get-frame-name.js');
var FieldComponent = require('./components/field-component.js').FieldComponent;
var create = function(){

    console.log("created internal hosted fields ");
    
    bus.emit('FRAME_SET', {
        hello:"Is it me you are calling"
    }, builder);
    
};

var builder = function(conf) {
    console.log("calling builder");

    var cardForm = new CreditCardForm(conf);

    //pack iframes together
    var iframes = packIframes.packIframes(window.parent);

    iframes.forEach(function(frame){
        frame.interswitch.hostedFields.initialize(cardForm);
    });

    bus.on("PAY_REQUEST", function(options, reply){
        console.log("handle the pay request");

        var payHandler = createPayHandler(cardForm.getCardData());
    });
    

};

var createPayHandler = function(cardForm){

    return function(options, reply) {

        var creditCardDetails = normalizeFields(cardForm.getCardData());

        options = options || {};

        //post response
        
    };
};

var normalizeFields = function(options){
    return;
}

var initialize = function(cardForm) {
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