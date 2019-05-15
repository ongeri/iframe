var queryString = require('../libs/query-string.js');
var isXHRAvailable = global.XMLHttpRequest && 'withCredentials' in new global.XMLHttpRequest();
var parseBody = require('./parse-body.js');
var prepBody = require('./prep-body.js');
var getRequestObject = function () {
    return isXHRAvailable ? new XMLHttpRequest() : new XDomainRequest();
};
var request = function (options, cb) {
//    console.log("XHR enabled ? " + isXHRAvailable);
    var status, resBody;

    var method = options.method;
    var url = options.url;
    var body = options.data;
    var timeout = options.timeout;
    var headers = options.headers || {};
    var req = getRequestObject();
    var callback = cb;

//    console.log("Request method: " + method);
//    console.log("url is: " + url);

    if (method === "GET") {
        url = queryString.querify(url, body);
        body = null;
    }

    //set up event listeners for XHR
    if (isXHRAvailable) {

        req.onreadystatechange = function () {

            if (req.readyState !== XMLHttpRequest.DONE) {//this should evaluate to 4
                //request is not complete
                return;
            }

            status = req.status;
            resBody = parseBody(req.responseText);

            if (status >= 400 || status < 200) {//non-200
//                console.log("an error occured in http request " + status);
                callback(resBody || 'error', null, status || 500);
            }
            else {
//                console.log(" a good response came back");
                callback(null, resBody, status);
            }


        };
    }
    else { //set up listeners for XDR
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
            callback('timeout', null, -1);//
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
    }
    catch (e) {
        //do nothing
    }

};//end of request method


module.exports = {
    request: request,
    queryString: queryString
};
