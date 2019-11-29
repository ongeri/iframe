const bus = require('framebus');
const CreditCardForm = require('./models/credit-card-form.js').CreditCardForm;
const packIframes = require('./pack-iframes.js');
const frameName = require('./get-frame-name.js');
const FieldComponent = require('./components/field-component.js').FieldComponent;
const events = require('../hosted-fields/events.js');
//var request = require('../request');
const injectWithBlacklist = require('inject-stylesheet').injectWithBlacklist;
const request = require('request');
const forwarderUrl = require('./constant.js').forwarder.url;
const forwarderAuth = require('./constant.js').forwarder.auth;
const constants = require('../libs/constants');
const SecureManager = require('./secure.js');

const getSecureDataKE = function (options) {
    const pan = options.pan || null;
    const expDate = options.expDate || null;
    const cvv = options.cvv || null;
    const pin = options.pin || null;
    const amount = options.amount || null;
    const mobile = options.mobile || null;
    const ttId = options.ttId || null;
    const publicModulus = options.publicModulus || null;
    const publicExponent = options.publicExponent || null;

    const secureOptions = {
        expiry: expDate,
        pan: pan,
        amount: amount,
        mobile: mobile,
        ttId: ttId,
        tokenize: options.tokenize,
        cardvstokenradio: options.cardvstokenradio
    };

    const pinData = {
        pin: pin,
        cvv: cvv,
        expiry: expDate
    };

    return SecureManager.generateSecureDataKE(secureOptions, pinData);
};

const create = function () {

    bus.emit(events.FRAME_SET, {}, builder);

};

const builder = function (conf) {
//    console.log("builder");
    const payments = {
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
        reqId: conf.reqId || "",
        customerInfor: conf.customerInfor || "",
        domain: conf.domain || "",
        narration: conf.narration || "",
        fee: conf.fee || "",
        preauth: conf.preauth || "",
        tokenize: conf.tokenize || "",
        tranleg: conf.tranleg || "",
    };
    //var payments = conf.payments;
//    console.log("payment call: " + JSON.stringify(payments));
//    console.log("forwarderUrl : " + forwarderUrl);
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
        } else if (res.statusCode !== 201) {
            //
        }
        else {
//            console.log(JSON.stringify(body));
            const client = conf.client;

            const cardForm = new CreditCardForm(conf);

            Object.keys(conf).forEach(function (key) {
                // console.log("storing " + key + " " + conf[key]);
                cardForm.set(key + ".value", conf[key]);
            });

            //should save some items to the card form

            //pack iframes together
            const iframes = packIframes.packIframes(window.parent);

            iframes.forEach(function (frame) {
                frame.interswitch.hostedFields.initialize(cardForm);
            });

            const cardvstokenradioContainer = cardForm.fieldComponents.find((fieldComponent) => {
                return fieldComponent.fieldType === constants.formMap.cardvstokenradio.name;
            });
            if (cardvstokenradioContainer) {
                cardvstokenradioContainer.children.card.checked = true;
                fireEvent(cardvstokenradioContainer, 'input');
                fireEvent(cardvstokenradioContainer.children.card, 'change');
            }

            bus.on(events.PAY_REQUEST, function (options, reply) {

                const payHandler = createPayHandler(client, cardForm);

                options.payments = conf;

                payHandler(options, reply);
            });

        }//end of else after making payments request
    });
};

function fireEvent(element, event) {
    let evt;
    if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();
        return element.fireEvent('on' + event, evt)
    } else {
        // dispatch for firefox + others
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}

const createPayHandler = function (client, cardForm) {

    return function (options, reply) {

        const isEmpty = cardForm.isEmpty();

        const invalidKeyData = cardForm.getInvalidFormField();
        let isValid = invalidKeyData.length === 0 ? true : false;

//        console.log("isempty - isValid " + isEmpty + " " + isValid);

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

//            console.log("error from source " + JSON.stringify(obj));
            reply(obj);
            return;
        }


        const creditCardDetails = cardForm.getCardData();

        options = options || {};

        //post response
//        console.log("credit card details is: ", JSON.stringify(client));
//        console.log(client);
//        console.log(creditCardDetails);
        const exp = creditCardDetails.exp;

        //creditCardDetails.exp = exp.charAt(3)+exp.charAt(2)+exp.charAt(0)+exp.charAt(1);0221
        creditCardDetails.exp = exp.charAt(3) + exp.charAt(4) + exp.charAt(0) + exp.charAt(1);

        var obj = {};
        Object.keys(creditCardDetails).forEach(function (key) {
            obj[key] = creditCardDetails[key];
        });

        obj.expDate = obj.exp;
        obj.amount = options.payments.amount;
        if (client._configuration.tokenize == '1') {// Optional tokenization, check user's choice
            obj.tokenize = obj.save ? '1' : '0';
        } else if (client._configuration.tokenize == '2') {// Never tokenize
            obj.tokenize = '0';
        } else {// Otherwise assume tokenize
            obj.tokenize = '1';
        }
//        console.log("obj to pass tlocalhost:7784o secure data " + JSON.stringify(obj) + " " + obj.pan);
        if (obj.cardvstokenradio === 'token') {
            obj.pan = obj.token;
        }
        const secureData = getSecureDataKE(obj);
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
        secureData.transactionRef = options.payments.transactionReference;
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
        secureData.reqId = options.payments.reqId;
        secureData.paca = "1";
        secureData.cardvstokenradio = creditCardDetails.cardvstokenradio;
        delete secureData.mac;

//        console.log(JSON.stringify(secureData));

        const url = "http://testids.interswitch.co.ke:9080/api/v1/merchant/transact/cards";
        const headerData = SecureManager.generateHeadersKE(client, url, "POST");
//        console.log(JSON.stringify(headerData));

        // cardInitialize("{\"country\":\"KE\",\"amount\":\"100\",\"authData\":\"U/v7WAcxI3HpVs+KXJzLAIhATiIYE+jjKgcVwHud0bBGJGPux08jQm240iGSyEmKxDJhP4FG/EGUVtBvDDGzY6xE+sM9lO9NNDA7+LwnrXTczBHsUzECQqwWRbT+7lrV4qtmZtkPb6uF+91bivIUYmU2q/5zvY8dleCc+ZzdqpfKicsgDafGYP8beuoOmi3L30ZlOZ7kap6OlCyEsgeFa8yJ/Y4e3S+3Y4LNTiFFFQmI/TVHF07/675QmJ8BsaQrMoUzbY6FdPNVjF8cdvdyQnVGFDoPC6a/op6uGisGFbuS1Hon+UOHMumG0B8N82a+VdgTKqiYUsns92gLv6PDvw==\",\"city\":\"NBI\",\"orderId\":\"kev3d7890\",\"customerInfor\":\"1002|kelvin|mwangi| kelvin.mwangi@interswitchgroup.com |0714171282|NBI|KE|00200|wstlnds|NBI\",\"fee\":\"0\",\"transactionRef\":\"kev3d7890\",\"terminalId\":\"3TLP0001\",\"terminalType\":\"WEB\",\"paymentItem\":\"CRD\",\"preauth\":\"0\",\"merchantId\":\"ISWKEN0001\",\"provider\":\"VSI\",\"narration\":\"Payment-Card\",\"currency\":\"KES\",\"domain\":\"ISWKEN\",\"paca\":\"1\"}", function (err, res, status) {
        reply(secureData);
    };
};

const initialize = function (cardForm) {
    let fieldComponent;

    const blacklist = ['background', 'display'];

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
