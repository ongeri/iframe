/**
 * Makes a request to the base server to process authorizationKey
 */
var request = require('../request');
var SecureManager = require('../internal/secure.js');

var getHeaderDataKE = function (client, url, httpMethod) {
    var client = client;
    var url = url;
    var httpMethod = httpMethod;

    return SecureManager.generateHeadersKE(client, url, httpMethod);
};

var processConfiguration = function (options, callback) {

    var configuration = {
        authorizationKey: options.authorizationKey,
        MID: options.MID
    };

    /*var configUrl = "http://172.16.112.4:3000/api/v1/configuration";

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
    });*/

    //var merchantConfigUrl = "http://172.16.112.4:3000/api/v1/merchant/configuration";

    var merchantConfigUrl = "https://testids.interswitch.co.ke:3000/api/v1/merchant/configuration/new";

    var url = "http://testids.interswitch.co.ke:9080/api/v1/merchant/mfb/config/" + options.MID;

    var headerConfig = {
        clientId: "IKIAB8FA9382D1FAC6FCA2F30195029B0A1558A9FECA",
        clientSecret: "dxdmtf12FhLVIFRz8IzhnuAJzNd6AAFVgx/3LlJHc+4="
    };
    var headerClient = {
        _configuration: headerConfig
    };
    var headerData = getHeaderDataKE(headerClient, url, "GET");

//    console.log(JSON.stringify(headerData));

    request({
            url: merchantConfigUrl,
            method: "GET",
            headers: headerData,
            data: configuration
        },
        function (err, res, status) {
            if (err) {
//                console.log("error in getting merchant configuration data " + JSON.stringify(err));
                callback(err, null);
            }
            else {
//                console.log("merchant configuration response " + JSON.stringify(res));
                var merchantConfigs = res;

                if (res.responseCode === "0") {
                    var esbresp = res;
                    var config = esbresp.config;

                    merchantConfigs = [
                        {
                            clienturl: 'https://testids.interswitch.co.ke:3000/api/'
                        },
                        {
                            MID: config.merchantId,
                            name: config.merchantName,
                            card: config.cardStatus.toString(),
                            mpesa: config.mpesaStatus.toString(),
                            equitel: config.equitelStatus.toString(),
                            tkash: config.tkashStatus.toString(),
                            airtel: config.airtelStatus.toString(),
                            paycode: config.paycodeStatus.toString(),
                            mpesaPaybill: config.mpesaPaybill,
                            equitelPaybill: config.equitelPaybill,
                            clientId: config.clientId,
                            clientSecret: config.clientSecret,
                            tokenize: isNaN(config.tokenizeStatus) ? "" : config.tokenizeStatus.toString(),
                            cardauth: isNaN(config.cardauthStatus) ? "" : config.cardauthStatus.toString(),
                            preauth: isNaN(config.cardPreauth) ? "" : config.cardPreauth.toString()
                        }

                    ];

                }

                for (var i = 0; i < merchantConfigs.length; i++) {
                    var obj = merchantConfigs[i];
                    if (i === 0) {
                        configuration.Urls = obj;
                    }
                    else {
                        /*console.log(obj.MID);
                        console.log(obj.clientId);
                        console.log(obj.clientSecret);
                        console.log(options.MID);*/

                        if (options.MID === obj.MID) {
//                            console.log("set clientid = " + obj.clientId);
//                            console.log("set cs = " + obj.clientSecret);
                            configuration.clientId = obj.clientId;
                            configuration.clientSecret = obj.clientSecret;
                            configuration.name = obj.name;
                            configuration.card = obj.card;
                            configuration.mpesa = obj.mpesa;
                            configuration.equitel = obj.equitel;
                            configuration.tkash = obj.tkash;
                            configuration.airtel = obj.airtel;
                            configuration.paycode = obj.paycode;
                            configuration.mpesaPaybill = obj.mpesaPaybill;
                            configuration.equitelPaybill = obj.equitelPaybill;
                            configuration.tokenize = obj.tokenize;
                            configuration.cardauth = obj.cardauth;
                            configuration.preauth = obj.preauth;
                        }
                    }


                }
                callback(null, configuration);
            }
        });

    //callback(null, configuration);
};

module.exports = processConfiguration;
