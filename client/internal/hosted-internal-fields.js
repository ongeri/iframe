var  bus = require('framebus');
var CreditCardForm = require('./models/credit-card-form.js').CreditCardForm;
var packIframes = require('./pack-iframes.js');
var frameName = require('./get-frame-name.js');
var FieldComponent = require('./components/field-component.js').FieldComponent;
var events = require('../hosted-fields/events.js');
var request = require('../request');
var injectWithBlacklist = require('inject-stylesheet').injectWithBlacklist;


var create = function(){
    
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

    bus.on(events.PAY_REQUEST, function(options,reply){

        var payHandler = createPayHandler(client, cardForm);

        payHandler(options, reply);
    });
    

};

var createPayHandler = function(client, cardForm){

    return function(options, reply) {

        var isEmpty = cardForm.isEmpty();

        var invalidKeyData = cardForm.getInvalidFormField();
        var isValid = invalidKeyData.length === 0 ? true : false;

        console.log("isempty - isValid "+isEmpty+" "+isValid);

        if(isEmpty) {
            
            var obj = {
                error:"All the fields are empty"
            };

            
            reply(obj);
            return;
        }

        if(!isValid) {
            
            var obj = {
                
                error:"Some fields are Invalid",
                detail: {data: invalidKeyData}
                
            };
            
            console.log("error from source "+JSON.stringify(obj));
            reply(obj);
            return;
        }


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
                var obj = {
                    error: err
                };
                reply(obj);
                return;
            }else {
                console.log("response from server "+res.message);
                //bus.emit("PAY_DONE", {res});
                //bus.off("PAY_DONE");
                reply(res);
            }
        });


        
    };
};

var normalizeFields = function(options){
    return;
}

var initialize = function(cardForm) {
    var fieldComponent;

    var blacklist = [ 'background', 'display' ];

    //inject merchant provided styles
     injectWithBlacklist(
        cardForm.conf.styles,
        blacklist
    );

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