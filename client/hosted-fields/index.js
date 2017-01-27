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

var newInstance = function(options, callback) {

  var instance;

  noCallback(callback, "newInstance");

  try{
    instance = new ISWHostedFields(options);
  }
  catch(err) {
    callback(err);
    return;
  }

  //set event listener to do callback when loading is complete
  instance.on("READY", function(){
    callback(null, instance);
    //console.log("ready to roxk and tole");
  });
  

};

module.exports = {
  newInstance: newInstance
};
