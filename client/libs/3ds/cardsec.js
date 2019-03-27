// require('./jquery-3.3.1.min');
require('./songbird_v1.js');
import $ from "jquery";

const baseUrl = "https://testmerchant.interswitch-ke.com";
const payload = "";
let eresp = "";
let iresp = "";


//console.log('text');

//configure cardinal
Cardinal.configure({
    logging: {
        level: "on"
    }
});

Cardinal.on('payments.setupComplete', function (setupCompleteData) {

    alert("initiating setup");
    console.log('text');
    alert(setupCompleteData.sessionId);
    alert(JSON.stringify(setupCompleteData));
    Cardinal.trigger("bin.process", '1234567894561237');
    alert("done with setup");
    const ireq = payload;
    checkEnrollAction(ireq, setupCompleteData.sessionId);
    // Do something
});

Cardinal.on("payments.validated", function (data, jwt) {
    alert('initiating validate');
    //alert(data);
    alert(jwt);
    alert('data: ' + JSON.stringify(data));
    //alert('jwt: '+JSON.stringify(jwt));
    //var eresp = document.getElementById("eresp").innerHTML;
    const ireq = payload;
    alert('eresp: ' + eresp);
    alert('ireq: ' + ireq);
    //validateAction(eresp,JSON.stringify(data),jwt);
    validateAction(ireq, eresp, JSON.stringify(data), JSON.stringify(jwt));
    switch (data.ActionCode) {
        case "SUCCESS":
            alert('success');
            validateAction(ireq, eresp, JSON.stringify(data), JSON.stringify(jwt));
            // Handle successful transaction, send JWT to backend to verify
            break;

        case "NOACTION":
            alert("NOACTION");
            // Handle no actionable outcome
            break;

        case "FAILURE":
            alert("FAILURE");
            // Handle failed transaction attempt
            break;

        case "ERROR":
            alert("ERROR");
            // Handle service level error
            break;
    }
});

function cardInitialize(payload, callback) {

    alert("cardInitialize(payload): " + payload);

    //document.getElementById("ireq").innerHTML = payload;

    $.get(baseUrl + "/merchant/card/initialize", {requestStr: payload}, function (response) {
        //document.getElementById("iresp").innerHTML = JSON.stringify(response);
        iresp = JSON.stringify(response);
        if (response.jwt) {
            alert(JSON.stringify(response));

            //configure cardinal
            Cardinal.configure({
                logging: {
                    level: "on"
                }
            });


            Cardinal.on('payments.setupComplete', function (setupCompleteData) {

                alert("initiating setup");
                console.log('text');
                alert(setupCompleteData.sessionId);
                alert(JSON.stringify(setupCompleteData));
                Cardinal.trigger("bin.process", '1234567894561237');
                alert("done with setup");
                const ireq = payload;
                checkEnrollAction(ireq, setupCompleteData.sessionId);
                // Do something
            });

            Cardinal.on("payments.validated", function (data, jwt) {
                alert('initiating validate');
                //alert(data);
                alert(jwt);
                alert('data: ' + JSON.stringify(data));
                //alert('jwt: '+JSON.stringify(jwt));
                //var eresp = document.getElementById("eresp").innerHTML;
                const ireq = payload;
                alert('eresp: ' + eresp);
                alert('ireq: ' + ireq);
                //validateAction(eresp,JSON.stringify(data),jwt);
                validateAction(ireq, eresp, JSON.stringify(data), JSON.stringify(jwt));
                switch (data.ActionCode) {
                    case "SUCCESS":
                        alert('success');
                        validateAction(ireq, eresp, JSON.stringify(data), JSON.stringify(jwt));
                        // Handle successful transaction, send JWT to backend to verify
                        break;

                    case "NOACTION":
                        alert("NOACTION");
                        // Handle no actionable outcome
                        break;

                    case "FAILURE":
                        alert("FAILURE");
                        // Handle failed transaction attempt
                        break;

                    case "ERROR":
                        alert("ERROR");
                        // Handle service level error
                        break;
                }
            });

            alert('jwt: ' + response.jwt);
            //validate account
            Cardinal.setup("init", {
                jwt: response.jwt
            });

            alert('done initiate');
            console.log('text8888');

        } else {
            alert(JSON.stringify(response));
            alert("card not enrolled");
        }
    }).done(function () {
        callback("second success", null, undefined);
    }).fail(function () {
        callback("error", null, undefined);
    }).always(function () {
        callback("finished", null, undefined);
    });
}

function checkEnrollAction(payload, referenceId) {

    $.get(baseUrl + "/merchant/card/enrolled1", {referenceId: referenceId, requestStr: payload}, function (response) {

        //document.getElementById("eresp").innerHTML = JSON.stringify(response);
        eresp = JSON.stringify(response);
        if (response.transactionRef) {
            alert(JSON.stringify(response));
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


                alert("continue initiated");
            } else {

                //var eresp = document.getElementById("eresp").innerHTML;
                authorizeAction(payload, eresp);

            }

        } else {
            alert(JSON.stringify(response));
            alert("card not enrolled");
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

        if (response.transactionRef) {
            alert(JSON.stringify(response));
            alert("done validate");
            notifyAction("Validate", "0", JSON.stringify(response), payload);

        } else {
            alert(JSON.stringify(response));
            alert("validation failed");
            notifyAction("Validate", "1", JSON.stringify(response), payload);
        }
    });

}

function authorizeAction(payload, eresp) {

    $.get(baseUrl + "/merchant/card/authorize1", {eresp: eresp, requestStr: payload}, function (response) {

        if (response.transactionRef) {
            alert(JSON.stringify(response));
            alert("done authorize");
            notifyAction("Authorize", "0", JSON.stringify(response), payload);

        } else {
            alert(JSON.stringify(response));
            alert("Authorization failed");
            notifyAction("Authorize", "1", JSON.stringify(response), payload);
        }
    });

}

function notifyAction(transactionType, respStatus, resp, payload) {

    $.get(baseUrl + "/merchant/card/notify", {
        transactionType: transactionType,
        respStatus: respStatus,
        responseStr: resp,
        requestStr: payload
    }, function (response) {

        if (response.responseCode) {
            alert(JSON.stringify(response));
            alert("done notify");

        } else {
            alert(JSON.stringify(response));
            alert("Notify failed");
        }
    });

}

function callbackFunction(xmlhttp) {
    //alert(xmlhttp.responseXML);
}


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + s4() + s4() +
        s4() + s4() + s4() + s4();
}

function timestamp() {
    //return Date.now() / 1000 | 0;
    return Math.floor(Date.now() / 1000);
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
    return Sha1.toHexStr(H0) + Sha1.toHexStr(H1) + Sha1.toHexStr(H2) +
        Sha1.toHexStr(H3) + Sha1.toHexStr(H4);
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
function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
        str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
}

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}


module.exports = {
    cardInitialize: cardInitialize
};