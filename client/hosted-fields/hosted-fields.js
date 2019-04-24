import {cardInitialize} from "../3ds/cardsec";

var Backbone = require('backbone');
var iFramer = require("../utilities/iframe/index.js");
var frameInjector = require('./frame-inject.js');
var bus = require('framebus');
var EventEmitter = require('../libs/event-emitter.js');
var noCallback = require('../libs/no-callback.js');
var uuid = require('../libs/uuid.js');
var constants = require('../libs/constants.js');
var events = require('./events.js');
var toggler = require('../libs/class-toggle.js');
var externalClasses = constants.externalClasses;


var createInputEventHandler = function (fields) {
    /*
    *
    * for example
    *
    * fields[cardCVV] = {
    *    frameElement: frame
    *    containerElement: container
    * }
    *
    * #remember that container points to the primary div that the merchant passed in initially.
    *
    *
    *
    *
    *
    *
    **/

    return function (eventData) {

        var field;
        var merchantPayload = eventData.merchantPayload;
        var emittedBy = merchantPayload.emittedBy;
        var container = fields[emittedBy].containerElement;


        console.log(JSON.stringify(eventData));

        Object.keys(merchantPayload.fields).forEach(function (key) {
            merchantPayload.fields[key].container = fields[key].containerElement;
        });

        field = merchantPayload.fields[emittedBy];

        console.log("emmited by " + emittedBy + " event name " + eventData.type);

        console.log(!field.isPotentiallyValid + "-" + field.isValid);
        //change class of elements here

        var classGroup = container.classList;

        //toggler.toggle(container, "focused", field.isFocused);

        // container.classList.toggle("focused", field.isFocused);
        // container.classList.toggle("valid", field.isValid);
        // container.classList.toggle("inValid", !field.isPotentiallyValid);
        //toggler.toggle(container, "valid", field.isValid);

        toggler.toggle(container, externalClasses.FOCUSED, field.isFocused);
        toggler.toggle(container, externalClasses.VALID, field.isValid);
        toggler.toggle(container, externalClasses.INVALID, !field.isPotentiallyValid);

        this._state = {
            fields: merchantPayload.fields,
            cards: merchantPayload.cards
        };

        this._emit(eventData.type, merchantPayload);

    };
};
var HostedFields = function (options) {

    var failureTimeout;


    var self = this;
    var fields = {};
    var fieldCount = 0;
    var componentId = uuid();

    if (!options.client) {
        //throw exception because we need client for certain https calls
    }

    if (!options.fields) {
        //throw exception because there should be fields to work with
    }

    console.log("Options are ", options);

    EventEmitter.call(this);

    //console.log("Location is "+location.href);

    this._injectedNodes = [];

    this._fields = fields;

    /**
     * state of the form
     */
    this._state = {
        fields: {}
    };

    //when we tear this down, we also want to teardown all backbone listener :TODO
    this._client = options.client;


    Object.keys(options.fields).forEach(function (key) {
        var field, container, frame;

        /**
         * we can validate on fields
         * pan cvv exp pin
         */

        field = options.fields[key];

        container = document.querySelector(field.selector);

        //console.log("associated selector "+container);

        if (!container) {
            frame.interswitch.hostedFields.initialize(cardForm);
            console.log("No container element with id ", field.selector, " was found for field ", key);
            throw new Error({
                message: "The Field " + field.selector + " does not exist."
            });
        }
        else if (container.querySelector('iframe[name^="isw-"]')) {
            console.log("Multiple container elements with id ", field.selector, " ware found for field ", key);
            throw new Error({
                message: "Duplicate " + field.selector + " already contains an iframe."
            });
        }

        console.log("Creating field using key and field values in container", key, field, container);

        frame = iFramer({
            type: key,
            name: 'isw-hosted-field-' + key,
            style: constants.DEFAULTIFRAMESTYLE
        });


        this._injectedNodes = this._injectedNodes.concat(frameInjector(frame, container));

        //attach event listener on the label associated with the  container :TODO

        fields[key] = {
            frameElement: frame,
            containerElement: container
        };

        fieldCount += 1;

        this._state.fields[key] = {
            isEmpty: true,
            isValid: false,
            isFocused: false,
            isPotentiallyValid: true,
            container: container
        };

        //run atleast after 0secs
        setTimeout(function () {
            frame.src = "http://localhost:3000/file";
        }, 0);

    }.bind(this));

    failureTimeout = setTimeout(function () {
        //notify analytics that there was a timeout
        console.log("timeout to set up frame on time");
    }, constants.INTEGRATION_TIMEOUT_MS);

    bus.on(events.FRAME_SET, function (args, reply) {

        fieldCount -= 1;

        if (fieldCount === 0) {
            clearTimeout(failureTimeout);
            reply(options);
            self._emit(events.READY);
        }
    });

    bus.on(events.INPUT_EVENT, createInputEventHandler(fields).bind(this));

};

HostedFields.prototype = Object.create(EventEmitter.prototype, {
    constructor: HostedFields
});
//HostedFields.constructor = HostedFields;

HostedFields.prototype.pay = function (options, callback) {

    if (!callback) {
        callback = options;
        options = {};
    }

    noCallback(callback, 'pay');

    var t = handlePayResponse(callback);
    bus.emit("PAY_REQUEST", {}, t);


    // bus.on("PAY_DONE", function(options, reply){
    //     console.log("calling pay_done trigger");
    //     callback(null, options);
    // });

};

var handlePayResponse = function (data) {

    return function (obj) {
        if (obj && obj.error) {
            console.log("error from payment " + JSON.stringify(obj));
            var err = new Error({
                message: obj.error,
                detail: obj.detail
            });
            data(err);
            return;
        } else {
            console.trace(JSON.stringify(obj));
            cardInitialize(JSON.stringify(obj)
                , function (err, res, status) {
                    if (err) {

                        var obj = {
                            error: err
                        };
                        data(obj);
                    } else {
                        let resultObject = JSON.parse(res);
                        data(null, {body: resultObject});
                    }
                });
        }
        console.log("response object " + JSON.stringify(obj));
    };
};

module.exports = HostedFields;
