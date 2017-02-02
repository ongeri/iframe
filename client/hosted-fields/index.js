/**
* @module hosted-fields-frame
* @description Entry point to create a hosted field
*
*
*
**/
var  bus = require('framebus');
var ISWHostedFields = require('./hosted-fields.js');
var noCallback = require('../libs/no-callback.js');
var deferred = require('../libs/deferred.js');
var events = require('./events.js');

var newInstance = function(options, callback) {

  var instance;

  noCallback(callback, "newInstance");

  try{
    instance = new ISWHostedFields(options);
  }
  catch(err) {
    callback = deferred(callback);
    callback(err);
    return;
  }

  instance.on(events.READY, function(){
    callback(null, instance);
  });
  

};

module.exports = {
  newInstance: newInstance
};
