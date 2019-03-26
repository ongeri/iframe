var noCallback = require('../libs/no-callback.js');
var processConfiguration = require('./processConfiguration.js');
var deferred = require('../libs/deferred.js');
var Client = require('./client.js');
/**
 * This module is the entry point to create
 * a client that communicates with interswitch 
 * servers
 * @param options. Options object.
 * @param options.authorizationKey. The merchantId. This is used to uniquely identify each merchant.
 * @param callback. Callback containing the client.
 */
var newInstanceValue = function(options, callback){
    //callback(null, null);
    //return;
    //check for no callback
    noCallback(callback, "newInstance")

    //check for deferred
    callback = deferred(callback);

    //create instance
    if(!options.authorizationKey) {
        callback(new Error({
            message: "Authorization Key is not set"
        }));
        return;
    }

    if(!options.MID) {
        callback(new Error({
            message: "MID is not set"
        }));
        return;
    }

    /*if(!options.clientId) {
        callback(new Error({
            message: "Client Id is not set"
        }));
        return;
    }

    if(!options.clientSecret) {
        callback(new Error({
            message: "Client Secret is not set"
        }));
        return;
    }*/

    /**
     * do network I/O for configuration data
     */
    processConfiguration(options, function(err, configuration){
        var client;
        console.log("response from remote in process  "+JSON.stringify(configuration));

        if(err) {
            callback(err);
            return;
        }

        try{
            //create client here
            client = new Client(configuration);
            //console.log("first client created "+client.request());
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
    newInstanceValue:newInstanceValue
};