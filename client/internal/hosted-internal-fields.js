var bus = require('framebus');
var CreditCardForm = require('./models/credit-card-form.js').CreditCardForm;
var packIframes = require('./pack-iframes.js');
var frameName = require('./get-frame-name.js');
var FieldComponent = require('./components/field-component.js').FieldComponent;
var events = require('../hosted-fields/events.js');
//var request = require('../request');
var injectWithBlacklist = require('inject-stylesheet').injectWithBlacklist;
var request = require('request');
var forwarderUrl = require('./constant.js').forwarder.url;
var forwarderAuth = require('./constant.js').forwarder.auth;
var SecureManager = require('./secure.js');

var getSecureData = function (options) {
    var pan = options.pan || null;
    var expDate = options.expDate || null;
    var cvv = options.cvv || null;
    var pin = options.pin || null;
    var amount = options.amount || null;
    var mobile = options.mobile || null;
    var ttId = options.ttId || null;
    var publicModulus = options.publicModulus || null;
    var publicExponent = options.publicExponent || null;

    var secureOptions = {
        expiry: expDate,
        pan: pan,
        amount: amount,
        mobile: mobile,
        ttId: ttId
    };

    var pinData = {
        pin: pin,
        cvv: cvv,
        expiry: expDate
    };

    return SecureManager.generateSecureData(secureOptions, pinData);
};

var getSecureDataKE = function (options) {
    var pan = options.pan || null;
    var expDate = options.expDate || null;
    var cvv = options.cvv || null;
    var pin = options.pin || null;
    var amount = options.amount || null;
    var mobile = options.mobile || null;
    var ttId = options.ttId || null;
    var publicModulus = options.publicModulus || null;
    var publicExponent = options.publicExponent || null;

    var secureOptions = {
        expiry: expDate,
        pan: pan,
        amount: amount,
        mobile: mobile,
        ttId: ttId
    };

    var pinData = {
        pin: pin,
        cvv: cvv,
        expiry: expDate
    };

    return SecureManager.generateSecureDataKE(secureOptions, pinData);
};

var getHeaderDataKE = function (client, url, httpMethod) {
    var client = client;
    var url = url;
    var httpMethod = httpMethod;

    return SecureManager.generateHeadersKE(client, url, httpMethod);
};


var create = function () {

    bus.emit(events.FRAME_SET, {}, builder);

};

var builder = function (conf) {
    console.log("builder");
    var payments = {
        transactionReference: conf.transactionReference || "",
        merchantCode: conf.merchantCode || "",
        currencyCode: conf.currencyCode || "",
        payableId: conf.payableId || "",
        amount: conf.amount || "",
        dateOfPayment: "2016-09-05T10:20:26",
        merchantCustomerId: conf.merchantCustomerId || "",
        channel: conf.channel || "",
        orderId: conf.orderId || "",
        terminalId: conf.terminalId || "",
        paymentItem: conf.paymentItem || "",
        provider: conf.provider || "",
        customerInfor: conf.customerInfor || "",
        domain: conf.domain || "",
        narration: conf.narration || "",
        fee: conf.fee || "",
        preauth: conf.preauth || "",
        tokenize: conf.tokenize || "",
        tranleg: conf.tranleg || "",
    };
    //var payments = conf.payments;
    console.log("payment call: " + JSON.stringify(payments));
    console.log("forwarderUrl : " + forwarderUrl);
    //make the payment call here
    request({
        url: forwarderUrl,
        json: true,
        body: payments,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: forwarderAuth
        }
    }, function (err, res, body) {
        if (err) {
            //find a way to throw exception message to client
        }
        else if (res.statusCode !== 201) {
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

            var orderId = body.orderId;
            var terminalId = body.terminalId;
            var paymentItem = body.paymentItem;
            var provider = body.provider;
            var customerInfor = body.customerInfor;
            var domain = body.domain;
            var narration = body.narration;
            var fee = body.fee;
            var preauth = body.preauth;
            var tokenize = body.tokenize;
            var tranleg = body.tranleg;

            var cardForm = new CreditCardForm(conf);

            Object.keys(body).forEach(function (key) {
                console.log("storing " + key + " " + body[key]);
                cardForm.set(key + ".value", body[key]);
            });

            //should save some items to the card form

            //pack iframes together
            var iframes = packIframes.packIframes(window.parent);

            iframes.forEach(function (frame) {
                frame.interswitch.hostedFields.initialize(cardForm);
            });

            bus.on(events.PAY_REQUEST, function (options, reply) {

                var payHandler = createPayHandler(client, cardForm);

                options.payments = body;

                payHandler(options, reply);
            });

        }//end of else after making payments request
    });


};

var createPayHandler = function (client, cardForm) {

    return function (options, reply) {

        var isEmpty = cardForm.isEmpty();

        var invalidKeyData = cardForm.getInvalidFormField();
        var isValid = invalidKeyData.length === 0 ? true : false;

        console.log("isempty - isValid " + isEmpty + " " + isValid);

        if (isEmpty) {

            var obj = {
                error: "All the fields are empty"
            };


            reply(obj);
            return;
        }

        if (!isValid) {

            var obj = {

                error: "Some fields are Invalid",
                detail: {data: invalidKeyData}

            };

            console.log("error from source " + JSON.stringify(obj));
            reply(obj);
            return;
        }


        var creditCardDetails = cardForm.getCardData();

        options = options || {};

        //post response
        console.log("credit card details is " + JSON.stringify(client));
        console.log(client);
        console.log(creditCardDetails);
        var exp = creditCardDetails.exp;

        //creditCardDetails.exp = exp.charAt(3)+exp.charAt(2)+exp.charAt(0)+exp.charAt(1);0221
        creditCardDetails.exp = exp.charAt(3) + exp.charAt(4) + exp.charAt(0) + exp.charAt(1);

        var obj = {};
        Object.keys(creditCardDetails).forEach(function (key) {
            obj[key] = creditCardDetails[key];
        });

        obj.expDate = obj.exp;
        obj.amount = options.payments.amount;
        console.log("obj to pass to secure data " + JSON.stringify(obj) + " " + obj.pan);

        var secureData = getSecureDataKE(obj);
        secureData.paymentId = options.payments.id;
        /*
        amount = amount
        orderId = orderId or transactionReference
        transactionRef = transactionReference
        terminalType = channel
        terminalId = terminalId
        paymentItem = paymentItem
        provider = provider
        merchantId = merchantCode
        authData = authData
        customerInfor = customerInfor
        */
        secureData.paymentId = options.payments.id;
        secureData.amount = options.payments.amount;
        secureData.transactionRef = options.payments.transactionRef;
        secureData.terminalType = options.payments.channel;
        secureData.terminalId = options.payments.terminalId;
        secureData.paymentItem = options.payments.paymentItem;
        secureData.provider = options.payments.provider;
        secureData.merchantId = options.payments.merchantCode;
        secureData.customerInfor = options.payments.customerInfor;
        secureData.orderId = options.payments.orderId;
        secureData.currencyCode = options.payments.currencyCode;
        secureData.currency = options.payments.currencyCode;//TODO To remove once backend stops f-ing me over
        secureData.domain = options.payments.domain;
        secureData.narration = options.payments.narration;
        secureData.fee = options.payments.fee;
        secureData.preauth = options.payments.preauth;
        secureData.paca = "1";
        delete secureData.mac;

        console.log(JSON.stringify(secureData));

        var url = "http://testids.interswitch.co.ke:9080/api/v1/merchant/transact/cards";
        var headerData = getHeaderDataKE(client, url, "POST");
        console.log(JSON.stringify(headerData));

        // cardInitialize("{\"country\":\"KE\",\"amount\":\"100\",\"authData\":\"U/v7WAcxI3HpVs+KXJzLAIhATiIYE+jjKgcVwHud0bBGJGPux08jQm240iGSyEmKxDJhP4FG/EGUVtBvDDGzY6xE+sM9lO9NNDA7+LwnrXTczBHsUzECQqwWRbT+7lrV4qtmZtkPb6uF+91bivIUYmU2q/5zvY8dleCc+ZzdqpfKicsgDafGYP8beuoOmi3L30ZlOZ7kap6OlCyEsgeFa8yJ/Y4e3S+3Y4LNTiFFFQmI/TVHF07/675QmJ8BsaQrMoUzbY6FdPNVjF8cdvdyQnVGFDoPC6a/op6uGisGFbuS1Hon+UOHMumG0B8N82a+VdgTKqiYUsns92gLv6PDvw==\",\"city\":\"NBI\",\"orderId\":\"kev3d7890\",\"customerInfor\":\"1002|kelvin|mwangi| kelvin.mwangi@interswitchgroup.com |0714171282|NBI|KE|00200|wstlnds|NBI\",\"fee\":\"0\",\"transactionRef\":\"kev3d7890\",\"terminalId\":\"3TLP0001\",\"terminalType\":\"WEB\",\"paymentItem\":\"CRD\",\"preauth\":\"0\",\"merchantId\":\"ISWKEN0001\",\"provider\":\"VSI\",\"narration\":\"Payment-Card\",\"currency\":\"KES\",\"domain\":\"ISWKEN\",\"paca\":\"1\"}", function (err, res, status) {
        reply(secureData);
    };
};

var createPayHandlerKE = function (client, cardForm) {

    return function (options, reply) {

        var isEmpty = cardForm.isEmpty();

        var invalidKeyData = cardForm.getInvalidFormField();
        var isValid = invalidKeyData.length === 0 ? true : false;

        console.log("isempty - isValid " + isEmpty + " " + isValid);

        if (isEmpty) {

            var obj = {
                error: "All the fields are empty"
            };


            reply(obj);
            return;
        }

        if (!isValid) {

            var obj = {

                error: "Some fields are Invalid",
                detail: {data: invalidKeyData}

            };

            console.log("error from source " + JSON.stringify(obj));
            reply(obj);
            return;
        }


        var creditCardDetails = cardForm.getCardData();

        options = options || {};

        //post response
        console.log("credit card details is " + JSON.stringify(client));
        console.log(client);
        console.log(creditCardDetails);
        var exp = creditCardDetails.exp;

        creditCardDetails.exp = exp.charAt(3) + exp.charAt(2) + exp.charAt(0) + exp.charAt(1);

        var obj = {};
        Object.keys(creditCardDetails).forEach(function (key) {
            obj[key] = creditCardDetails[key];
        });

        obj.expDate = obj.exp;
        obj.amount = options.payments.amount;
        console.log("obj to pass to secure data " + JSON.stringify(obj) + " " + obj.pan);

        var secureData = getSecureDataKE(obj);
        secureData.paymentId = options.payments.id;
        delete secureData.mac;

        console.log(JSON.stringify(secureData));

        request({
            method: "POST",
            json: true,
            body: secureData,
            url: "https://testids.interswitch.co.ke:3000/collections/pay",
            header: {
                'content-type': 'application/json'
            }
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

var normalizeFields = function (options) {
    return;
};

var initialize = function (cardForm) {
    var fieldComponent;

    var blacklist = ['background', 'display'];

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