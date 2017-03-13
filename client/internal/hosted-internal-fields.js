var  bus = require('framebus');
var CreditCardForm = require('./models/credit-card-form.js').CreditCardForm;
var packIframes = require('./pack-iframes.js');
var frameName = require('./get-frame-name.js');
var FieldComponent = require('./components/field-component.js').FieldComponent;
var events = require('../hosted-fields/events.js');
var request = require('../request');
var injectWithBlacklist = require('inject-stylesheet').injectWithBlacklist;
var request = require('request');
var forwarderUrl = require('./constant.js').forwarder.url;
var forwarderAuth = require('./constant.js').forwarder.auth;


var create = function(){
    
    bus.emit(events.FRAME_SET, {
    }, builder);
    
};

var builder = function(conf) {
    console.log("builder");
    var payments = conf.payments;
    console.log(JSON.stringify(payments));
    //make the payment call here
    request({
    url: forwarderUrl,
    json:true,
    body: payments,
    method: 'POST',
    headers: {
       'content-type': 'application/json',
       Authorization: forwarderAuth
    }
  }, function(err, res, body){
    if(err) {
      //find a way to throw exception message to client
    }
    else if(res.statusCode !== 201){
        //
    }
    else {
      console.log(JSON.stringify(body));

        var client = conf.client;

        var iD = body.id;
        var payableId = body.payableId;
        var amount = body.amount;
        var surcharge = body.surcharge;
        var paymentCancelled = body.paymentCancelled;
        var dateOfPayment = body.dateOfPayment;
        var remittanceAmount = body.remittanceAmount;
        var currencyCode = body.currencyCode;
        var merchantCustomerId = body.merchantCustomerId;
        var transactionReference = body.transactionReference;
        var responseCode = body.responseCode;
        var responseDescription = body.responseDescription;
        var channel = body.channel;
        var merchantCode = body.merchantCode;

        var cardForm = new CreditCardForm(conf);

        Object.keys(body).forEach(function(key){
            console.log("storing "+key+" "+body[key]);
            cardForm.set(key+".value", body[key]);
        });

        //should save some items to the card form

        //pack iframes together
        var iframes = packIframes.packIframes(window.parent);

        iframes.forEach(function(frame){
            frame.interswitch.hostedFields.initialize(cardForm);
        });

        bus.on(events.PAY_REQUEST, function(options,reply){

            var payHandler = createPayHandler(client, cardForm);

            payHandler(options, reply);
        });

    }//end of else after making payments request
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