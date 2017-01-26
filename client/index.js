/**
* Interswitch Hosted Fields Implementation
* @module interswitch-client-sdk
* @description This is the parent module exported by interswitch client side sdk
* @author ugochukwu.okeke
*
*
*
**/
var ISWClient = require('./ISWClient').ISWClient;
var ISWContainerFields=require('./hosted-fields/index.js');
// var Backbone = require('backbone');
// var $ = require('jquery');
// Backbone.$ = $;
// window.Interswitch={
//     client:ISWClient,
//     containerFields:ISWContainerFields,
//     backbone:Backbone
// }

window.interswitch = {
  client: ISWClient,
  hostedFields: ISWContainerFields
};
