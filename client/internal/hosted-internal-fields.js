var  bus = require('framebus');
var CreditCardForm = require('./models/credit-card-form.js').CreditCardForm;
var packIframes = require('./pack-iframes.js');
var frameName = require('./get-frame-name.js');
var FieldComponent = require('./components/field-component.js').FieldComponent;
var events = require('../hosted-fields/events.js');
var request = require('../request');


var create = function(){

    console.log("-send event back to merchant of successful loading>>> ");
    
    bus.emit(events.FRAME_SET, {
    }, builder);
    
};

var builder = function(conf) {

    console.log("---> building started>>>");

    var client = conf.client;
    //console.log("client object in builder "+JSON.stringify(conf));

    var cardForm = new CreditCardForm(conf);

    //pack iframes together
    var iframes = packIframes.packIframes(window.parent);

    iframes.forEach(function(frame){
        frame.interswitch.hostedFields.initialize(cardForm);
    });

    bus.on("PAY_REQUEST", function(options, reply){
        console.log("handle the pay request");

        var payHandler = createPayHandler(client, cardForm);

        payHandler(options, reply);
    });
    

};

var createPayHandler = function(client, cardForm){

    return function(options, reply) {

        var creditCardDetails = cardForm.getCardData();

        options = options || {};

        //post response
        console.log("credit card details is "+JSON.stringify(client));
        console.log(client);
        console.log(creditCardDetails);

        request({
            method: "POST",
            data: {
                creditCardDetails
            },
            url: "http://localhost:3000/api/v1/payment/hosted"
        }, function(err, res, status){
            if(err) {
                console.log("error paying "+err);
                reply(err);
                return;
            }else {
                console.log("response from server "+res.message);
                bus.emit("PAY_DONE", {res});
            }
        });


        
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

    //here a document is the one inside the frame
    document.body.appendChild(fieldComponent.element);
};

module.exports = {
    create: create,
    initialize: initialize
};