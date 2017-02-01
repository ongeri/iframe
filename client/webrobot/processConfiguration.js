/**
 * Makes a request to the base server to process authorizationKey
 */
var request = require('../request');
var processConfiguration = function(options, callback){

    var configuration = {
        authorizationKey : options.authorizationKey
    };

    var configUrl = "http://localhost:3000/api/v1/configuration";

    request({
        url: configUrl,
        method: "GET",
        data:configuration
    }, 
    function(err, res, status){
        if(err) {
            console.log("error in getting configuration data "+JSON.stringify(err));
            callback(err, null);
        }
        else {
            console.log("configuration response "+JSON.stringify(res));
            configuration.Urls = res
            callback(null, configuration);
        }
    });

    //callback(null, configuration);
};

module.exports = processConfiguration;