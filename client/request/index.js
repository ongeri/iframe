var once = require('../libs/once.js');
var isHTTP = require('./is-http.js');
var getUserAgent = require('./get-user-agent.js');
var AjaxDriver = require('./ajax-driver.js');
var ajaxIsAvailable;

var ajaxAvailable = function(){

    if (ajaxIsAvailable == null) {
        console.log(global.navigator.userAgent);
        ajaxIsAvailable = !(isHTTP() && /MSIE\s(8|9)/.test(getUserAgent()));
    }

  return ajaxIsAvailable;
};
module.exports = function(options, callback) {
    
    callback = once(callback);
    options.method = (options.method || 'GET').toUpperCase();
    options.timeout = options.timeout == null ? 60000 : options.timeout;
    options.data = options.data || {};

    if(ajaxAvailable()) {
        //IE more likely
        console.log("use IE");
    }
    else {
        //use jsondriver
        console.log("make request for me");
    }

    // callback(null,{});
};