var noCallback = require('../libs/no-callback.js');
var processConfiguration = require('./processConfiguration.js');
var Client = require('./client.js');
/**
 * This module is the entry point to create
 * a client that communicates with interswitch 
 * servers
 * @param options. Options object.
 * @param options.authorizationKey. The merchantId. This is used to uniquely identify each merchant.
 * @param callback. Callback containing the client.
 */
var newInstance = function(options, callback){
    
    //check for no callback
    noCallback(callback, "newInstance")

    //check for deferred :TODO

    //create instance
    if(!options.authorizationKey) {
        callback(new Error({
            message: "Authorization Key is not set"
        }));
        return;
    }

    processConfiguration(options, function(err, configuration){
        var client;

        if(err) {
            callback(err);
            return;
        }

        try{
            //create client here
            client = new Client(configuration);
        }
        catch(e) {
            callback(e);
            return;
        }

        //client created correctly
        callback(null, client)
    });
};

module.exports = {
    newInstance:newInstance
};