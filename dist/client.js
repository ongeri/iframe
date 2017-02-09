(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = function (fn) {
    return function () {

        var args = arguments;
        setTimeout(function () {
            fn.apply(null, args);
        }, 1);
    };
};

},{}],2:[function(require,module,exports){
'use strict';

//throws an error if the callback is not a function
module.exports = function (callback, functionName) {
  if (typeof callback !== 'function') {
    throw new Error({
      message: functionName + ' must include a callback function.'
    });
  }
};

},{}],3:[function(require,module,exports){
"use strict";

module.exports = function (fn) {
    var called = false;
    return function () {
        if (!called) {
            called = true;
            fn.apply(null, arguments);
        }
    };
};

},{}],4:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var querify = function querify(url, params) {

    url = url || '';

    if (params != null && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' && _notEmpty(params)) {
        url += url.indexOf("?") === -1 ? "?" : "";
        url += url.indexOf("=") !== -1 ? "&" : "";
        url += stringify(params);
    }

    return url;
};

//recursive DFS on a json string with O(N) memory
// O(N+M) time processing function. Fast enough
var stringify = function stringify(obj, namespace) {
    var k, v, p;
    var query = [];

    for (p in obj) {

        if (!obj.hasOwnProperty(p)) {
            continue;
        }

        v = obj[p];

        if (namespace) {

            //if array, change k
            if (_isArray(obj)) {
                k = namespace + '[]';
            }
            //else obj so change k
            else {
                    k = namespace + '[' + p + ']';
                }
        } else {
            k = p;
        }

        if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
            query.push(stringify(v, k));
        } else {
            query.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    console.log("final query " + query.join("&"));
    return query.join("&");
};

var _isArray = function _isArray(value) {

    return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.length === 'number' && Object.prototype.toString.call(value) === '[object Array]' || false;
};

/**
 * checks if an object is non empty
 */
var _notEmpty = function _notEmpty(obj) {
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
};

module.exports = {
    querify: querify,
    stringify: stringify
};

},{}],5:[function(require,module,exports){
'use strict';

/**
 * Please read  rfc4122
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

module.exports = uuid;

},{}],6:[function(require,module,exports){
(function (global){
'use strict';

var queryString = require('../libs/query-string.js');
var isXHRAvailable = global.XMLHttpRequest && 'withCredentials' in new global.XMLHttpRequest();
var parseBody = require('./parse-body.js');
var prepBody = require('./prep-body.js');
var getRequestObject = function getRequestObject() {
    return isXHRAvailable ? new XMLHttpRequest() : new XDomainRequest();
};
var request = function request(options, cb) {
    console.log("XHR enabled ? " + isXHRAvailable);
    var status, resBody;

    var method = options.method;
    var url = options.url;
    var body = options.data;
    var timeout = options.timeout;
    var headers = options.headers || {};
    var req = getRequestObject();
    var callback = cb;

    console.log("Request method: " + method);
    console.log("url is: " + url);

    if (method === "GET") {
        url = queryString.querify(url, body);
        body = null;
    }

    //set up event listeners for XHR
    if (isXHRAvailable) {

        req.onreadystatechange = function () {

            if (req.readyState !== XMLHttpRequest.DONE) {
                //this should evaluate to 4
                //request is not complete
                return;
            }

            status = req.status;
            resBody = parseBody(req.responseText);

            if (status >= 400 || status < 200) {
                //non-200
                console.log("an error occured in http request " + status);
                callback(resBody || 'error', null, status || 500);
            } else {
                console.log(" a good response came back");
                callback(null, resBody, status);
            }
        };
    } else {
        //set up listeners for XDR
        req.onload = function () {
            callback(null, parseBody(req.responseText), req.status);
        };
        req.onerror = function () {
            callback('error', null, 500);
        };
        req.onprogress = function () {
            //do nothing
        };
        req.ontimeout = function () {
            callback('timeout', null, -1); //
        };
    }

    //open the socket asyncly
    req.open(method, url, true);
    req.timeout = timeout;

    //set the headers one last time
    if (isXHRAvailable) {
        req.setRequestHeader("Content-Type", "application/json");
        // TODO: Make this work in IE9.
        //
        // To do this, we'll change these URL and headers...
        // /api/v1
        // Content-Type: text/xml
        // Authorization: Bearer 123456
        //
        // ...to this URL:
        // /my/endpoint?content_type=text%2Fxml&authorization:Bearer+123456

        Object.keys(headers).forEach(function (headerKey) {
            req.setRequestHeader(headerKey, headers[headerKey]);
        });
    }

    try {
        //body should be a string
        req.send(prepBody(method, body));
    } catch (e) {
        //do nothing
    }
}; //end of request method


module.exports = {
    request: request,
    queryString: queryString
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../libs/query-string.js":4,"./parse-body.js":11,"./prep-body.js":12}],7:[function(require,module,exports){
(function (global){
"use strict";

module.exports = function () {
    return global.navigator.userAgent;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
(function (global){
'use strict';

var once = require('../libs/once.js');
var isHTTP = require('./is-http.js');
var getUserAgent = require('./get-user-agent.js');
var AjaxDriver = require('./ajax-driver.js');
var JSONPDriver = require('./jsonp-driver.js');
var ajaxIsAvailable;

var ajaxAvailable = function ajaxAvailable() {

    if (ajaxIsAvailable == null) {
        console.log(global.navigator.userAgent);
        ajaxIsAvailable = !(isHTTP() && /MSIE\s(8|9)/.test(getUserAgent()));
    }

    return ajaxIsAvailable;
};
module.exports = function (options, callback) {

    callback = once(callback);
    options.method = (options.method || 'GET').toUpperCase();
    options.timeout = options.timeout == null ? 60000 : options.timeout;
    options.data = options.data || {};

    if (ajaxAvailable()) {
        //IE more likely
        console.log("normal browser or IE");
        // var root = {
        //     name: {
        //         first: "arthur",
        //         last: "okeke"
        //     },
        //     age: [1,2,3]
        // };
        // //AjaxDriver.request(options, callback);
        // var out = AjaxDriver.queryString.stringify(root);
        //console.log(out);

        // var conf = {
        //     method: "GET",
        //     timeout: "5000",
        //     data: "",
        //     url:"http://localhost:3000/status"
        // };

        // JSONPDriver.request(conf, function(err, res, status){
        //     if(err) {
        //         console.log("error "+JSON.stringify(err));
        //     }else {
        //         console.log(status);
        //         console.log(res);
        //     }
        // });
        AjaxDriver.request(options, callback);
    } else {
        //use jsondriver
        console.log("use jsonp");
        JSONPDriver.request(options, callback);
    }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../libs/once.js":3,"./ajax-driver.js":6,"./get-user-agent.js":7,"./is-http.js":9,"./jsonp-driver.js":10}],9:[function(require,module,exports){
(function (global){
"use strict";

module.exports = function () {
    return global.location.protocol === "http:";
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
(function (global){
'use strict';

var queryString = require('../libs/query-string.js');
var uuid = require('../libs/uuid.js');
var timeouts = {};
var head;
var request = function request(options, callback) {

    var script;
    var callbackName = 'callback_json_' + uuid().replace(/-/g, '');
    var url = options.url;
    var attrs = options.data;
    var method = options.method;
    var timeout = options.timeout;

    url = queryString.querify(url, attrs);
    console.log("url after firs call " + url);
    url = queryString.querify(url, {
        _method: method,
        callback: callbackName
    });

    console.log("url for jsonp is " + url);

    script = _createScriptTag(url, callbackName);
    console.log("script tag created " + JSON.stringify(script));
    _setupGlobalCallback(script, callback, callbackName);
    _setupTimeout(timeout, callbackName);

    if (!head) {
        head = document.getElementsByTagName('head')[0];
    }
    console.log("the head element " + JSON.stringify(head) + " " + JSON.stringify(head.childNodes));
    head.appendChild(script);
};

var _createScriptTag = function _createScriptTag(url, callbackName) {

    var script = document.createElement('script');

    var done = false;

    script.src = url;
    script.async = true;
    script.type = "text/javascript";

    script.onerror = function () {
        global[callbackName]({ message: 'error', status: 500 });
    };

    script.onload = script.onreadstatechange = function () {
        if (done) return;

        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
            done = true;
            script.onload = script.onreadstatechange = null;
        }
    };

    return script;
};
var _setupGlobalCallback = function _setupGlobalCallback(script, callback, callbackName) {

    global[callbackName] = function (response) {
        var status = response.status || 500;
        var err = null;
        var data = null;

        console.log("response is back " + status);

        delete response.status;

        if (status >= 400 || status < 200) {
            err = response;
        } else {
            data = response;
        }

        _cleanupGlobal(callbackName);

        _removeScript(script);

        clearTimeout(timeouts[callbackName]);

        callback(err, data, status);
    };
};
var _setupTimeout = function _setupTimeout(timeout, callbackName) {

    timeouts[callbackName] = setTimeout(function () {
        console.log("times out");
        timeouts[callbackName] = null;

        global[callbackName]({
            error: 'timeout',
            status: -1
        });

        /**
         * when there is a timeout,
         * this key will be cleaned
         * so re-assign it
         * and eventually cleapup again afterwards
         */
        global[callbackName] = function () {
            _cleanupGlobal(callbackName);
        };
    }, timeout);
};

var _cleanupGlobal = function _cleanupGlobal(callbackName) {
    try {
        delete global[callbackName];
    } catch (e) {
        global[callbackName] = null;
    }
};

var _removeScript = function _removeScript(script) {
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
};

module.exports = {
    request: request
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../libs/query-string.js":4,"../libs/uuid.js":5}],11:[function(require,module,exports){
"use strict";

/**
 * assumes body is a json string
 */
module.exports = function (body) {
    try {
        body = JSON.parse(body);
    } catch (e) {}

    return body;
};

},{}],12:[function(require,module,exports){
'use strict';

module.exports = function (method, body) {

    if (typeof method !== 'string') {
        throw new Error("method must be a string");
    }
    if (method.toLowerCase() !== 'get' && body != null) {
        body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    return body;
};

},{}],13:[function(require,module,exports){
'use strict';

var noCallback = require('../libs/no-callback.js');
var processConfiguration = require('./processConfiguration.js');
var deferred = require('../libs/deferred.js');
var Client = require('./client.js');
/**
 * This module is the entry point to create
 * a client that communicates with interswitch 
 * servers
 * @param options. Options object.
 * @param options.authorizationKey. The merchantId. This is used to uniquely identify each merchant.
 * @param callback. Callback containing the client.
 */
var newInstanceValue = function newInstanceValue(options, callback) {
    //callback(null, null);
    //return;
    //check for no callback
    noCallback(callback, "newInstance");

    //check for deferred
    callback = deferred(callback);

    //create instance
    if (!options.authorizationKey) {
        callback(new Error({
            message: "Authorization Key is not set"
        }));
        return;
    }

    /**
     * do network I/O for configuration data
     */
    processConfiguration(options, function (err, configuration) {
        var client;
        console.log("response from remote in process  " + JSON.stringify(configuration));

        if (err) {
            callback(err);
            return;
        }

        try {
            //create client here
            client = new Client(configuration);
            //console.log("first client created "+client.request());
        } catch (e) {
            callback(e);
            return;
        }

        //client created correctly
        callback(null, client);
    });
};

module.exports = {
    newInstanceValue: newInstanceValue
};

},{"../libs/deferred.js":1,"../libs/no-callback.js":2,"./client.js":14,"./processConfiguration.js":16}],14:[function(require,module,exports){
"use strict";

var request = require('../request');
var Client = function Client(configuration) {
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
    } else if (!options.endpoint) {
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

var _functionCallback = function _functionCallback(callback) {
    var err;
    return function (err, res, status) {

        if (status === -1) {
            err = new Error({
                message: "Timeout"
            });
            callback(err, null, status);
        } else if (status < 200 || status >= 400) {
            err = new Error({
                message: "Failure"
            });
            callback(err, null, status);
        } else {
            callback(null, res, status);
        }
    };
};

module.exports = Client;

},{"../request":8}],15:[function(require,module,exports){
'use strict';

var client = require('./boot.js');
window.interswitch = window.interswitch || {};
window.interswitch.client = client;

},{"./boot.js":13}],16:[function(require,module,exports){
"use strict";

/**
 * Makes a request to the base server to process authorizationKey
 */
var request = require('../request');
var processConfiguration = function processConfiguration(options, callback) {

    var configuration = {
        authorizationKey: options.authorizationKey
    };

    var configUrl = "http://localhost:3000/api/v1/configuration";

    request({
        url: configUrl,
        method: "GET",
        data: configuration
    }, function (err, res, status) {
        if (err) {
            console.log("error in getting configuration data " + JSON.stringify(err));
            callback(err, null);
        } else {
            console.log("configuration response " + JSON.stringify(res));
            configuration.Urls = res;
            callback(null, configuration);
        }
    });

    //callback(null, configuration);
};

module.exports = processConfiguration;

},{"../request":8}]},{},[15]);
