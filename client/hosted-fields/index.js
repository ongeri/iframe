/**
 * @module hosted-fields-frame
 * @description Entry point to create a hosted field
 *
 *
 *
 **/
var bus = require('framebus');
var ISWHostedFields = require('./hosted-fields.js');
var noCallback = require('../libs/no-callback.js');
var deferred = require('../libs/deferred.js');
var events = require('./events.js');
var request = require('../request');

var newInstance = function (options, callback) {

    //make, create payment request
    /*var postData = {
      transactionReference: options.transactionReference || "",
      merchantCode: options.merchantCode || "",
      currencyCode: options.currencyCode || "",
      payableId: options.payableId || "",
      amount: options.amount || "",
      dateOfPayment: "2016-09-05T10:20:26",
      merchantCustomerId: options.merchantCustomerId || "",
      channel: options.channel || "",
      orderId: options.orderId || "",
      terminalId: options.terminalId || "",
      paymentItem: options.paymentItem || "",
      provider: options.provider || "",
      customerInfor: options.customerInfor || "",
    };

    console.log("create payment request data "+JSON.stringify(postData));
    console.log("client object "+options.client);

    request({
      url: 'http://localhost:3000/collections/payment',
      // json:true,
      data: postData,
      method: 'post',
      headers: {
        // 'content-type': 'application/json',
        // Authorization: "Bearer eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsiaXN3LWNvbGxlY3Rpb25zIiwiaXN3LWNvcmUiLCJpc3ctaW5zdGl0dXRpb24iLCJpc3ctcGF5bWVudGdhdGV3YXkiLCJwYXNzcG9ydCJdLCJzY29wZSI6WyJwcm9maWxlIl0sImp0aSI6ImI2NWEyNTI4LTc5YjMtNDIyNi05MmQxLWY2NTVkM2ExOTE5MyIsImNsaWVudF9pZCI6Imlzdy1wYXltZW50Z2F0ZXdheSJ9.JFDZlcOquq07T_-lqeDPJl9N2zT5pziWzI7HTcoUgz3MyUKvBuTbOsBbjLaXX4SEHe78kw62Tqq2seboJMoK6K6k89-pA4-hHcWw2y7qFEhZThxJtQeBk6VtfjcfJZYwRjSGgbl7uA7_K0729iRjlFucBdS7DzzAZC90FtotIVJvvFlBtTvSSzMC33RUcZliPpcz4CDEXfZupNLG-QgHtt8vNrGQxR6tYGiPPbbbnWZIJk7wcdwE_TmQsvgF83NmDGHnso_KFQcdQTz1GIYULzi38vxDMjwtD6vF3b_E_CvS3bOA8yhujzcvuJb1au915WMewW3VEj6d1bJsR2guAQ"
      }
    }, function(err, res, body){
      if(err) {
        console.log(JSON.stringify(err));
      }
      else {
        console.log(JSON.stringify(body));
      }
    });*/

    var instance;

    noCallback(callback, "newInstance");

    try {
        instance = new ISWHostedFields(options);
    }
    catch (err) {
        callback = deferred(callback);
        callback(err);
        return;
    }

    instance.on(events.READY, function () {
        callback(null, instance);
    });

};

module.exports = {
    newInstance: newInstance
};
