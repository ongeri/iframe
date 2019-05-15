var once = require('../libs/once.js');
var isHTTP = require('./is-http.js');
var getUserAgent = require('./get-user-agent.js');
var AjaxDriver = require('./ajax-driver.js');
var JSONPDriver = require('./jsonp-driver.js');
var ajaxIsAvailable;

var ajaxAvailable = function () {

    if (ajaxIsAvailable == null) {
//        console.log(global.navigator.userAgent);
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
//        console.log("normal browser or IE");
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

    }
    else {
        //use jsondriver
//        console.log("use jsonp");
        JSONPDriver.request(options, callback);
    }

};
