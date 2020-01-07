require('./songbird_v1.js');// Todo replace with node library import
// import $ from "jquery";

const baseUrl = "https://testmerchant.interswitch-ke.com";
let eresp = "";
let payload = "";
let callback;

function getIp() {
    let ip = "";
    jQuery.ajax({
        url: 'https://jsonip.com',
        success: function (data) {
            ip = data.ip;
        },
        async: false
    });
    return ip;
}

//configure cardinal
Cardinal.configure({
    logging: {
        level: "on"
    }
});

Cardinal.on('payments.setupComplete', paymentsCompleted);
Cardinal.on("payments.validated", paymentsValidated);

function cardInitialize(payloadParam, callbackParam) {
    const ip = getIp();
    payload = payloadParam;
    callback = callbackParam;
    payload = JSON.parse(payload);
    if (payload.customerInfor) {
        if (payload.customerInfor.split('|').length === 10) {
            payload.customerInfor = payload.customerInfor + '|' + ip + '|' + window.location.hostname + ' |' + getBrowserInfor();
        } else {
            payload.customerInfor = "| | | | | | | | | | |" + ip + '|' + window.location.hostname + ' |' + getBrowserInfor();
        }
    } else {
        payload.customerInfor = "| | | | | | | | | | |" + ip + '|' + window.location.hostname + ' |' + getBrowserInfor();
    }
    payload = JSON.stringify(payload);
    //    console.count("cardInitialize(payload): " + payload);
    $.get(baseUrl + "/merchant/card/initialize", {requestStr: payload}, function (response) {
        if (response.jwt) {

            //validate account
            Cardinal.setup("init", {
                jwt: response.jwt
            });

//            console.count("/merchant/card/initialize response:", JSON.stringify(response));
        } else {
            console.count("card not enrolled");
            callback(response, null, undefined);
        }
    }).done(function () {
        // callback("second success", null, undefined);
    }).fail(function () {
        callback("error", null, undefined);
    }).always(function () {
        // callback("finished", null, undefined);
    });
}

function tokenInitialize(payloadParam, callbackParam) {
    const ip = getIp();
    payload = payloadParam;
    callback = callbackParam;
    payload = JSON.parse(payload);
    if (payload.customerInfor) {
        if (payload.customerInfor.split('|').length === 10) {
            payload.customerInfor = payload.customerInfor + '|' + ip + '|' + window.location.hostname + ' |' + getBrowserInfor();
        } else {
            payload.customerInfor = "| | | | | | | | | | |" + ip + '|' + window.location.hostname + ' |' + getBrowserInfor();
        }
    } else {
        payload.customerInfor = "| | | | | | | | | | |" + ip + '|' + window.location.hostname + ' |' + getBrowserInfor();
    }
    payload = JSON.stringify(payload);
    //    console.count("cardInitialize(payload): " + payload);
    $.get(baseUrl + "/merchant/token/initialize", {requestStr: payload}, function (response) {
        if (response.jwt) {

            //validate account
            Cardinal.setup("init", {
                jwt: response.jwt
            });
            payload = JSON.stringify(response);
//            console.count("Response and new payload" + payload);
        } else {
            console.count("Token card not enrolled");
            callback(response, null, undefined);
        }
    }).done(function () {
        // callback("second success", null, undefined);
    }).fail(function () {
        callback("error", null, undefined);
    }).always(function () {
        // callback("finished", null, undefined);
    });
}

function paymentsCompleted(setupCompleteData) {
//    console.count("payments.setupComplete", setupCompleteData.sessionId);
    Cardinal.trigger("bin.process", '1234567894561237');
    checkEnrollAction(payload, setupCompleteData.sessionId);
}

function paymentsValidated(data, jwt) {
//    console.count('payments.validated', jwt);
//    console.count('eresp: ' + eresp);
//    console.count(JSON.stringify(data));
//    console.log("Data action code:", data.ActionCode);
    validateAction(payload, eresp, JSON.stringify(data), JSON.stringify(jwt));
    switch (data.ActionCode) {
        case "SUCCESS":
//            console.count('success');
            validateAction(payload, eresp, JSON.stringify(data), JSON.stringify(jwt));
            // Handle successful transaction, send JWT to backend to verify
            break;
        case "NOACTION":
//            console.count("NOACTION");
            // Handle no actionable outcome
            break;
        case "FAILURE":
//            console.count("FAILURE");
            // Handle failed transaction attempt
            callback(data);
            break;
        case "ERROR":
//            console.count("ERROR");
            // Handle service level error
            callback(data);
            break;
    }
}

function checkEnrollAction(payload, referenceId) {
    $.get(baseUrl + "/merchant/card/enrolled1", {referenceId: referenceId, requestStr: payload}, function (response) {
        //document.getElementById("eresp").innerHTML = JSON.stringify(response);
        eresp = JSON.stringify(response);
        if (response.transactionRef) {
//            console.count(JSON.stringify(response));
            if (response.csAcsURL) {
                Cardinal.continue('cca',
                    {
                        "AcsUrl": response.csAcsURL,
                        "Payload": response.csPaReq
                    },
                    {
                        "OrderDetails": {
                            "TransactionId": response.csAuthenticationTransactionID
                        }
                    },
                    response.jwt
                );
//                console.count("continue initiated");
            } else {
                //var eresp = document.getElementById("eresp").innerHTML;
                authorizeAction(payload, eresp);
            }
        } else {
//            console.count(JSON.stringify(response));
//            console.count("card not enrolled");
            notifyAction("Check", "1", JSON.stringify(response), payload);
        }
    });
}

function validateAction(payload, eresp, data, jwt) {
    $.get(baseUrl + "/merchant/card/validated1", {
        eresp: eresp,
        data: data,
        jwt: jwt,
        requestStr: payload
    }, function (response) {
//        console.count("Validation response", JSON.stringify(response));
        if (response.transactionRef) {
//            console.count("validation succeeded");
            notifyAction("Validate", "0", JSON.stringify(response), payload);
        } else {
//            console.count("validation failed");
            notifyAction("Validate", "1", JSON.stringify(response), payload);
        }
    });
}

function authorizeAction(payload, eresp) {
    $.get(baseUrl + "/merchant/card/authorize1", {eresp: eresp, requestStr: payload}, function (response) {
        if (response.transactionRef) {
//            console.count(JSON.stringify(response));
//            console.count("Successfully authorized" + response);
            callback(null, eresp, null);
            notifyAction("Authorize", "0", JSON.stringify(response), payload);
        } else {
//            console.count(JSON.stringify(response));
//            console.count("Authorization failed");
            notifyAction("Authorize", "1", JSON.stringify(response), payload);
            callback(response, null, undefined);
        }
    });
}

function notifyAction(transactionType, respStatus, resp, payload) {
//    console.log("Notifying outcome for " + transactionType + ", result status: " + respStatus + " response: " + resp);
    if (respStatus === "0") {
//        console.count("Notify succeeded");
        callback(null, resp, null);
    } else {
        callback(resp);
    }
    $.get(baseUrl + "/merchant/card/notify", {
        transactionType: transactionType,
        respStatus: respStatus,
        responseStr: resp,
        requestStr: payload
    }, function (response) {
//        console.count("Notify response", JSON.stringify(response));
        if (response.responseCode) {
//            console.count("Notify succeeded");
        } else {
//            console.count("Notify failed");
        }
    });
}

function getBrowserInfor() {
    const nAgt = navigator.userAgent;
    let browserName = navigator.appName;
    let fullVersion = '' + parseFloat(navigator.appVersion);
    let majorVersion = parseInt(navigator.appVersion, 10);
    let nameOffset, verOffset, ix;
    // In Opera 15+, the true version is after "OPR/"
    if ((verOffset = nAgt.indexOf("OPR/")) !== -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4);
    }
    // In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset = nAgt.indexOf("Opera")) !== -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) !== -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) !== -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() === browserName.toLowerCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) !== -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) !== -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }
    return browserName
}


'use strict';
const Sha1 = {};
/**
 * Generates SHA-1 hash of string.
 *
 * @param {string} msg - (Unicode) string to be hashed.
 * @returns {string} Hash of msg as hex character string.
 */
Sha1.hash = function (msg) {
    // convert string to UTF-8, as SHA only deals with byte-streams
    msg = msg.utf8Encode();
    // constants [Â§4.2.1]
    const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    // PREPROCESSING
    msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [Â§5.1.1]
    // convert string msg into 512-bit/16-integer blocks arrays of ints [Â§5.2.1]
    const l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + â€˜1â€™ + appended length
    const N = Math.ceil(l / 16); // number of 16-integer-blocks required to hold 'l' ints
    const M = new Array(N);
    for (var i = 0; i < N; i++) {
        M[i] = new Array(16);
        for (let j = 0; j < 16; j++) { // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [Â§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;
    // set initial hash value [Â§5.3.1]
    let H0 = 0x67452301;
    let H1 = 0xefcdab89;
    let H2 = 0x98badcfe;
    let H3 = 0x10325476;
    let H4 = 0xc3d2e1f0;
    // HASH COMPUTATION [Â§6.1.2]
    const W = new Array(80);
    let a, b, c, d, e;
    for (var i = 0; i < N; i++) {
        // 1 - prepare message schedule 'W'
        for (var t = 0; t < 16; t++) W[t] = M[i][t];
        for (var t = 16; t < 80; t++) W[t] = Sha1.ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
        // 2 - initialise five working variables a, b, c, d, e with previous hash value
        a = H0;
        b = H1;
        c = H2;
        d = H3;
        e = H4;
        // 3 - main loop
        for (var t = 0; t < 80; t++) {
            const s = Math.floor(t / 20); // seq for blocks of 'f' functions and 'K' constants
            const T = (Sha1.ROTL(a, 5) + Sha1.f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff;
            e = d;
            d = c;
            c = Sha1.ROTL(b, 30);
            b = a;
            a = T;
        }
        // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
        H0 = (H0 + a) & 0xffffffff;
        H1 = (H1 + b) & 0xffffffff;
        H2 = (H2 + c) & 0xffffffff;
        H3 = (H3 + d) & 0xffffffff;
        H4 = (H4 + e) & 0xffffffff;
    }
    return Sha1.toHexStr(H0) + Sha1.toHexStr(H1) + Sha1.toHexStr(H2) + Sha1.toHexStr(H3) + Sha1.toHexStr(H4);
};
/**
 * Function 'f' [Â§4.1.1].
 * @private
 */
Sha1.f = function (s, x, y, z) {
    switch (s) {
        case 0:
            return (x & y) ^ (~x & z); // Ch()
        case 1:
            return x ^ y ^ z; // Parity()
        case 2:
            return (x & y) ^ (x & z) ^ (y & z); // Maj()
        case 3:
            return x ^ y ^ z; // Parity()
    }
};
/**
 * Rotates left (circular left shift) value x by n positions [Â§3.2.5].
 * @private
 */
Sha1.ROTL = function (x, n) {
    return (x << n) | (x >>> (32 - n));
};
/**
 * Hexadecimal representation of a number.
 * @private
 */
Sha1.toHexStr = function (n) {
    // note can't use toString(16) as it is implementation-dependant,
    // and in IE returns signed numbers when used on full words
    let s = '', v;
    for (let i = 7; i >= 0; i--) {
        v = (n >>> (i * 4)) & 0xf;
        s += v.toString(16);
    }
    return s;
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/** Extend String object with method to encode multi-byte string to utf8
 * - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
if (typeof String.prototype.utf8Encode == 'undefined') {
    String.prototype.utf8Encode = function () {
        return unescape(encodeURIComponent(this));
    };
}
/** Extend String object with method to decode utf8 string to multi-byte */
if (typeof String.prototype.utf8Decode == 'undefined') {
    String.prototype.utf8Decode = function () {
        try {
            return decodeURIComponent(escape(this));
        } catch (e) {
            return this; // invalid UTF-8? return as-is
        }
    };
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
if (typeof module != 'undefined' && module.exports) module.exports = Sha1; // CommonJs export
module.exports = {
    cardInitialize: cardInitialize,
    tokenInitialize: tokenInitialize
};
