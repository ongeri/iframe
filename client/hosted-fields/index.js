/**
* @module hosted-fields-frame
* @description Entry point to create a hosted field
*
*
*
**/
var  bus = require('framebus');
var ISWHostedFields = require('./hosted-fields.js');

var newInstance = function(options, callback) {

  var instance;

  try{
    instance = new ISWHostedFields(options);
  }
  catch(err) {
    callback(err);
    return;
  }

  //set event listener to do callback when loading is complete
  bus.on("READY", function(){
    callback(null, instance);
    //console.log("ready to roxk and tole");
  });
  

};

module.exports = {
  newInstance: newInstance
};
