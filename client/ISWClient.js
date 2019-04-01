//"use strict";

var axios_1 = require("axios");
var ISWClient = (function () {
    function ISWClient(authorzation) {
        this._configuration = {
            baseUrl: "http://localhost:3000/api/v1/hostfields/",
            endpoint: "authorization/configuration"
        };
        this._settings = null;
        this._authorization = authorzation;
    }

    ISWClient.prototype.send = function (callbackFunction) {
        console.log("send function of the client");
        var _this = this;
        if (this._authorization === null || this._authorization === undefined) {
            throw new Error("Authorization must be set before making a call");
        }
        axios_1.default((this._configuration.baseUrl + this._configuration.endpoint), {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            _this._settings = response.data;
            callbackFunction(_this._settings);
        }, function (error) {
            console.log(error);
            callbackFunction(error);
        });
    };
    ISWClient.prototype.getSettings = function () {
        if (this._settings !== null) {
            return this._settings;
        }
        else {
            return false;
        }
    };
    return ISWClient;
}());
module.exports.ISWClient = ISWClient;
