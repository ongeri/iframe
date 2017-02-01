var queryString = require('../libs/query-string.js');
var uuid = require('../libs/uuid.js');
var timeouts = {};
var head;
var request = function(options, callback) {

    var script;
    var callbackName = 'callback_json_' + uuid().replace(/-/g, '');
    var url = options.url;
    var attrs = options.data;
    var method = options.method;
    var timeout = options.timeout;

    url = queryString.querify(url, attrs);
    console.log("url after firs call "+url);
    url = queryString.querify(url, {
        _method: method,
        callback: callbackName
    });

    console.log("url for jsonp is "+url);

    script = _createScriptTag(url, callbackName);
    console.log("script tag created "+JSON.stringify(script));
    _setupGlobalCallback(script, callback, callbackName);
    _setupTimeout(timeout, callbackName);

    if(!head) {
        head = document.getElementsByTagName('head')[0];
    }
    console.log("the head element "+JSON.stringify(head)+" "+JSON.stringify(head.childNodes));
    head.appendChild(script);
};

var _createScriptTag = function(url, callbackName){

    var script = document.createElement('script');

    var done = false;

    script.src = url;
    script.async = true;
    script.type = "text/javascript";

    script.onerror = function(){
        global[callbackName]({message:'error', status:500});
    };

    script.onload = script.onreadstatechange = function(){
        if(done) return;

        if(!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
            done=true;
            script.onload = script.onreadstatechange = null;
        }
    };

    return script;
};
var _setupGlobalCallback = function(script, callback, callbackName ){

    global[callbackName] = function(response){
        var status = response.status || 500;
        var err = null;
        var data = null;

        console.log("response is back "+status);

        delete response.status;

        if (status >= 400 || status < 200) {
            err = response;
        }
        else {
            data = response;
        }

        _cleanupGlobal(callbackName);

        _removeScript(script);

        clearTimeout(timeouts[callbackName]);

        callback(err, data, status);
    };
};
var _setupTimeout = function(timeout, callbackName){

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

var _cleanupGlobal = function(callbackName){
    try{
        delete global[callbackName];
    }
    catch(e) {
        global[callbackName] = null;
    }
};

var _removeScript = function(script){
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
};


module.exports = {
    request: request
};