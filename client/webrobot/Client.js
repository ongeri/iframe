var request = require('../request');
var Client = function (configuration) {
    /**
     * important urls are to be returned back to client from the server
     *
     */
    var urlConf;
    configuration = configuration || {};
    urlConf = configuration.Urls;
    if (!urlConf) {
        throw new Error("Client missing Url configuration object");
    }
    console.log("constructed client instance");
    this._configuration = configuration;
    this._request = request;
    this._baseUrl = urlConf.clienturl;
};

Client.prototype.request = function (options, callback) {

    var optionName;

    if (!options.method) {
        optionName = 'options.method';
    }
    else if (!options.endpoint) {
        optionsName = 'options.endpoint';
    }

    if (optionName) {
        var err = new Error({
            message: "Bad Request " + optionName + "- not set"
        });

        callback(err);
        return;
    }

    this._request({
        url: this._baseUrl + options.endpoint,
        method: options.method,
        data: options.data,
        headers: options.headers,
        timeout: options.timeout
    }, this._functionCallback(callback));
};

var _functionCallback = function (callback) {
    var err;
    return function (err, res, status) {

        if (status === -1) {
            err = new Error({
                message: "Timeout"
            });
            callback(err, null, status);
        }
        else if (status < 200 || status >= 400) {
            err = new Error({
                message: "Failure"
            });
            callback(err, null, status);
        }
        else {
            callback(null, res, status);
        }
    };
};

module.exports = Client;