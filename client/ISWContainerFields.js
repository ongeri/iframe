//"use strict";

var iFramer = require("./utilities/iframe/index.js");
var FrameInjector = require("./utilities/FrameInjector").FrameInjector;
console.log(FrameInjector);
var ISWContainerFields = (function () {
    function ISWContainerFields(client) {
        this.internalInstance = client;
    }


    ISWContainerFields.prototype.setFields = function (fieldConfiguration) {
        var _this = this;
        var keys = Object.keys(fieldConfiguration);
        keys.forEach(function (item) {
          console.log("a key of config is "+item);
            _this.hasItemSelector(fieldConfiguration[item]);
        });
        this.inputFieldConfig = fieldConfiguration;
    };


    ISWContainerFields.prototype.hasItemSelector = function (fieldConfigItem) {

      //no no, must use reasonable defaults please
        if (fieldConfigItem.selector === undefined || fieldConfigItem.selector === null) {
            throw new Error("Selector property must be present in the Field Object");
        }
    };


    ISWContainerFields.prototype.getHostedFields = function () {
        var _this = this;
        if (this.inputFieldConfig === null || this.inputFieldConfig === undefined) {
            throw new Error("Fields must be defined before making the call");
        }
        var keys = Object.keys(this.inputFieldConfig);
        keys.forEach(function (item) {
            _this.hasItemSelector(_this.inputFieldConfig[item]);
            //If Error is not thrown let's check that the selectors exists
            var selectorElementContainer;
            var frameElement;
            var field;
            field = _this.inputFieldConfig[item]; // The Current Field
            console.log("Field as shown in iterator "+field);
            selectorElementContainer = document.querySelector(field.selector);
            if (!selectorElementContainer) {
                throw new Error("Selector failed to match an existing element. [" + field.selector + "]");
            }
            //Create an iframe and return it back to me
            frameElement = iFramer({
                type: item,
                name: 'isw-hosted-fields' + Math.floor((Math.random() * 1000000000)),
                style: {
                    border: 'none',
                    width: '100%',
                    height: '50px',
                    'float': 'left'
                }
            });

            //Append the iframe to the div
            new FrameInjector(frameElement, selectorElementContainer);
            console.log(frameElement+" created");
            setTimeout(function () {
                //frameElement.src = (_this.internalInstance.getSettings().assetsUrl + "?2376857857575157723");
                frameElement.src = "https://assets.braintreegateway.com/web/3.6.3/html/hosted-fields-frame.html#f50f566c-add0-4b1c-ba2c-86e5578d8d82";
            }, 2);
        });
    };


    return ISWContainerFields;
}());
exports.ISWContainerFields = ISWContainerFields;
