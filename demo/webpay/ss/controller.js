function doAuthorize() {
    var httpMethod = "POST";
    var url = "https://esb.interswitch-ke.com:18082/api/v1/merchant/transact/bills";
    url = url.replace("http://", "https://");
    url = encodeURIComponent(url);

    var timestamp = Date.now() / 1000 | 0;
    var nonce = guid();
    var clientId = "IKIAB8FA9382D1FAC6FCA2F30195029B0A1558A9FECA";
    var authorization = "InterswitchAuth" + " " + b64EncodeUnicode(clientId);
    var clientSecret = "dxdmtf12FhLVIFRz8IzhnuAJzNd6AAFVgx/3LlJHc+4=";


    var signatureCipher = httpMethod + "&" + url + "&" + timestamp + "&" + nonce + "&" + clientId + "&" + clientSecret;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url
        "method": "POST",
        "headers": {

            "Authorization": "InterswitchAuth SUtJQUI4RkE5MzgyRDFGQUM2RkNBMkYzMDE5NTAyOUIwQTE1NThBOUZFQ0E=",
            "Content-Type": "application/json",
            "Signature": "7rLCKvXBOQl/MUiqtSt0LLl+LTI=",
            "SignatureMethod": "SHA1",
            "Timestamp": "1531748679",
            "Nonce": "ee5ec0f531901956105aef0d45e74ead",
            "Cache-Control": "no-cache",
            "Postman-Token": "809bcf51-6ef7-4e63-bd95-51d1057230f2"
        },
        "processData": false,
        "data": "{\r\n  \"amount\": \"250\",\r\n    \"orderId\": \"6680928910\",\r\n    \"phone\": \"254713167623\",\r\n    \"transactionRef\": \"6680928918\",\r\n    \"terminalType\": \"MOBILE\",\r\n    \"paymentItem\":\"MMO\",\r\n    \"provider\": \"703\",\r\n    \"merchantId\": \"100\",\r\n    \"callBackUrl\":\"webpaycallback\",\r\n    \"isLog\":\"0\",\r\n    \"narration\": \"Payment\",\r\n    \"fee\":\"25\"\r\n}"
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
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
var Sha1 = {};

/**
 * Generates SHA-1 hash of string.
 *
 * @param {string} msg - (Unicode) string to be hashed.
 * @returns {string} Hash of msg as hex character string.
 */
Sha1.hash = function (msg) {
    // convert string to UTF-8, as SHA only deals with byte-streams
    msg = msg.utf8Encode();
    // constants [§4.2.1]
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    // PREPROCESSING
    msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [§5.1.1]
    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l / 16); // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);
    for (var i = 0; i < N; i++) {
        M[i] = new Array(16);
        for (var j = 0; j < 16; j++) { // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;
    // set initial hash value [§5.3.1]
    var H0 = 0x67452301;
    var H1 = 0xefcdab89;
    var H2 = 0x98badcfe;
    var H3 = 0x10325476;
    var H4 = 0xc3d2e1f0;
    // HASH COMPUTATION [§6.1.2]
    var W = new Array(80);
    var a, b, c, d, e;
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
            var s = Math.floor(t / 20); // seq for blocks of 'f' functions and 'K' constants
            var T = (Sha1.ROTL(a, 5) + Sha1.f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff;
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
 * Function 'f' [§4.1.1].
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
 * Rotates left (circular left shift) value x by n positions [§3.2.5].
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
    var s = '', v;
    for (var i = 7; i >= 0; i--) {
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

