var Backbone = require('backbone');
var iFramer = require("../utilities/iframe/index.js");
var frameInjector = require('./frame-inject.js');
var $ = require('jquery');
var bus = require('framebus');

Backbone.$ = $;
var _ = require('underscore');

var HostedFields = function(options){

  //mixin with backbone event listener
  _.extend(this, Backbone.Events);


  console.log("hosted field has been created");

  var self = this;
  var fields = {};
  var fieldCount = 0;
  var componentId = 1;

  if(!options.client){
    //throw exception because we need client for certain https calls
  }

  if(!options.fields) {
    //throw exception because there should be fields to work with
  }

  this._injectedNodes = [];

  this._fields = fields;

  this._state = {
    fields: {}
  };

  //when we tear this down, we also want to teardown all backbone listener :TODO

  this._client = options.client;



  Object.keys(options.fields).forEach(function(key){
    var field, container, frame;

    console.log("Value of key "+key);

    //validate the field name : TODO

    field = options.fields[key];

    container = document.querySelector(field.selector);

    console.log("associated selector "+container);

    if(!container) {
      //bad situation stop execution, this is where
      //we should insert the iframe so nothing happens
    }
    else if(container.querySelector('iframe')) {
      //bad situation there is a duplicate element
      //throw exception
    }

    frame = iFramer({
      type: key,
      name: 'isw-hosted-field-' + key,
      style: {
          border: 'none',
          width: '100%',
          height: '50px',
          'float': 'left'
      }
    });

    console.log("associated frame "+frame);

    this._injectedNodes = this._injectedNodes.concat(frameInjector(frame, container));

    //attach event listener on the label associated with the  container :TODO

    fields[key] = {
      frameElement: frame,
      containerElement: container
    };
    fieldCount+=1;

    this._state.fields[key] = {
      isEmpty: true,
      container: container
    };

    setTimeout(function(){
      frame.src="http://localhost:3000/file";//load another page with another javascript and we continue from there
    }, 0); //run atleast after 0secs


  }.bind(this));//end of key interpolation

  console.log("The elements in the injection array include "+this._injectedNodes);

  bus.on("FRAME_SET", function(args,reply){
    
    fieldCount -= 1; //reduce the counter and build the frame once all is loaded
    if(fieldCount === 0) {
      console.log("ready to build the things ");
      
      reply(options);
      bus.emit("READY");
     // reply.contents.callme(options);
    }
  });


};

//HostedFields.constructor = HostedFields;

HostedFields.prototype.pay = function(options, callback){

  if(!callback) {
    callback = options;
    options = {};
  }

  bus.emit("PAY_REQUEST", options, function(response){
    callback(null, response);
  });

};

module.exports = HostedFields;
