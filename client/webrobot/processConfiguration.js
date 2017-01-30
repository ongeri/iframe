/**
 * Makes a request to the base server to process authorizationKey
 */
var processConfiguration = function(options, callback){

    var configuration = {
        authorizationKey : options.authorizationKey
    };

    callback(null, configuration);
};

module.exports = processConfiguration;