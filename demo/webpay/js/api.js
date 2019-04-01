function sendMMO2(clientId, clientSecret, ItemJSON) {
    var httpMethod = "POST";
    var url1 = "http://172.16.112.4:9080/api/v1/merchant/transact/bills";
    var url = "http://172.16.112.4:9080/api/v1/merchant/transact/bills";
    url = url.replace("http://", "https://");
    url = encodeURIComponent(url);

    var timestamp = Date.now() / 1000 | 0;
    var nonce = guid();
    var authorization = "InterswitchAuth" + " " + b64EncodeUnicode(clientId);


    var signatureCipher = httpMethod + "&" + url + "&" + timestamp + "&" + nonce + "&" + clientId + "&" + clientSecret;

    alert("sendMMO(clientId, clientSecret, ItemJSON) " + clientId + " " + clientSecret);

    var redirecturl = '/merchant/payment/page/payment/update';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.open("POST", url1, false);
    xmlhttp.setRequestHeader("Authorization", authorization);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Signature", hexToBase64(Sha1.hash(signatureCipher)));
    xmlhttp.setRequestHeader("SignatureMethod", "SHA1");
    xmlhttp.setRequestHeader("Timestamp", timestamp);
    xmlhttp.setRequestHeader("Nonce", nonce);
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.send(ItemJSON);

    if (xmlhttp.status == "200") {
        var res = JSON.parse(xmlhttp.responseText);
        res.responseCode = "00";

        return JSON.stringify(res);

    } else {
        var res = JSON.parse(xmlhttp.responseText);
        res.responseCode = "01";

        return JSON.stringify(res);
    }
}

function sendPaycode2(clientId, clientSecret, ItemJSON) {
    var httpMethod = "POST";
    var url1 = "http://172.16.112.4:9080/api/v1/merchant/transact/paycodes";
    var url = "http://172.16.112.4:9080/api/v1/merchant/transact/paycodes";
    url = url.replace("http://", "https://");
    url = encodeURIComponent(url);

    var timestamp = Date.now() / 1000 | 0;
    var nonce = guid();
    var authorization = "InterswitchAuth" + " " + b64EncodeUnicode(clientId);


    var signatureCipher = httpMethod + "&" + url + "&" + timestamp + "&" + nonce + "&" + clientId + "&" + clientSecret;

    alert("sendPaycode2(clientId, clientSecret, ItemJSON) " + clientId + " " + clientSecret);

    var redirecturl = '/merchant/payment/page/payment/update';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.open("POST", url1, false);
    xmlhttp.setRequestHeader("Authorization", authorization);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Signature", hexToBase64(Sha1.hash(signatureCipher)));
    xmlhttp.setRequestHeader("SignatureMethod", "SHA1");
    xmlhttp.setRequestHeader("Timestamp", timestamp);
    xmlhttp.setRequestHeader("Nonce", nonce);
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.send(ItemJSON);

    if (xmlhttp.status == "200") {
        var res = JSON.parse(xmlhttp.responseText);
        res.responseCode = "00";

        return JSON.stringify(res);

    } else {
        var res = JSON.parse(xmlhttp.responseText);
        res.responseCode = "01";

        return JSON.stringify(res);
    }

}

function sendMMO() {
    var httpMethod = "POST";
    var url1 = "http://172.16.112.4:9080/api/v1/merchant/transact/bills";
    var url = "http://172.16.112.4:9080/api/v1/merchant/transact/bills";
    url = url.replace("http://", "https://");
    url = encodeURIComponent(url);

    var timestamp = Date.now() / 1000 | 0;
    var nonce = guid();
    var clientId = "IKIAB8FA9382D1FAC6FCA2F30195029B0A1558A9FECA";
    var authorization = "InterswitchAuth" + " " + b64EncodeUnicode(clientId);
    var clientSecret = "dxdmtf12FhLVIFRz8IzhnuAJzNd6AAFVgx/3LlJHc+4=";


    var signatureCipher = httpMethod + "&" + url + "&" + timestamp + "&" + nonce + "&" + clientId + "&" + clientSecret;

    var ItemJSON;

    //ItemJSON = '[  {    "Id": 1,    "ProductID": "1",    "Quantity": 1,  },  {    "Id": 1,    "ProductID": "2",    "Quantity": 2,  }]';

    var amount = '100';//$('.amount').text();
    var orderId = '1234';//$('.orderId').text();
    var terminalType = 'MOBILE';//$('.terminalType').text();
    //var merchantId = $('.merchantId').text();
    var merchantId = "100";
    var mmoProvider = '703';//$('#Combobox1').val();
    var phone = '1234567';//$.trim($('#Editbox6').val());
    var ref = '123456'//$('.ref').text();

    alert(mmoProvider + "-" + phone);

    ItemJSON = JSON.stringify({
        "country": "KE",
        "currency": "KES",
        "amount": amount,
        "orderId": orderId,
        "phone": phone,
        "transactionRef": orderId,
        "terminalType": terminalType,
        "paymentItem": "MMO",
        "provider": mmoProvider,
        "merchantId": merchantId,
        "callBackUrl": "webpaycallback",
        "isLog": "0",
        "narration": "Payment",
        "fee": "0"
    });

    //URL = "https://testrestapi.com/additems?var=" + urlvariable;  //Your URL

    var redirecturl = '/merchant/payment/page/payment/update';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.open("POST", url1, false);
    xmlhttp.setRequestHeader("Authorization", authorization);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Signature", hexToBase64(Sha1.hash(signatureCipher)));
    xmlhttp.setRequestHeader("SignatureMethod", "SHA1");
    xmlhttp.setRequestHeader("Timestamp", timestamp);
    xmlhttp.setRequestHeader("Nonce", nonce);
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.send(ItemJSON);
    //alert(xmlhttp.responseText);
    //document.getElementById("div").innerHTML = xmlhttp.statusText + ":" + xmlhttp.status + "<BR><textarea rows='100' cols='100'>" + xmlhttp.responseText + "</textarea>";
    if (xmlhttp.status == "200") {
        var res = JSON.parse(xmlhttp.responseText);
        var payref = res.transactionRef;
        console.log(payref);
        alert("Payment successful with payment ref of " + payref);
        return;
        alert("Payment Posted Successfully");
        $(location).attr("href", redirecturl + "?paymentRef=" + ref + "&status=00&channel=mmo");
        document.getElementById("div").innerHTML = "Payment Posted Successfully";
        document.getElementById("div1").innerHTML = "";

    } else {
        document.getElementById("div").innerHTML = "";
        document.getElementById("div1").innerHTML = "Payment Failed";
        alert("Payment Failed");
        return;
        //$(location).attr("href", redirecturl+"?paymentRef="+ref+"&status=01&channel=mmo");
    }
}

function sendPaycode() {
    var httpMethod = "POST";
    var url1 = "http://172.16.112.4:9080/api/v1/merchant/transact/paycodes";
    var url = "http://172.16.112.4:9080/api/v1/merchant/transact/paycodes";
    url = url.replace("http://", "https://");
    url = encodeURIComponent(url);

    var timestamp = Date.now() / 1000 | 0;
    var nonce = guid();
    var clientId = "IKIAB8FA9382D1FAC6FCA2F30195029B0A1558A9FECA";
    var authorization = "InterswitchAuth" + " " + b64EncodeUnicode(clientId);
    var clientSecret = "dxdmtf12FhLVIFRz8IzhnuAJzNd6AAFVgx/3LlJHc+4=";


    var signatureCipher = httpMethod + "&" + url + "&" + timestamp + "&" + nonce + "&" + clientId + "&" + clientSecret;

    var ItemJSON;

    //ItemJSON = '[  {    "Id": 1,    "ProductID": "1",    "Quantity": 1,  },  {    "Id": 1,    "ProductID": "2",    "Quantity": 2,  }]';

    var amount = $('.amount').text();
    var orderId = $('.orderId').text();
    var terminalType = $('.terminalType').text();
    //var merchantId = $('.merchantId').text();
    var merchantId = '100';
    var token = $.trim($('#Editbox4').val());
    var pin = $.trim($('#Editbox5').val());
    var ref = $('.ref').text();

    alert(token + "-" + pin + "-" + amount);

    /*
     * "amount": "20000",
  "country": "KE",
  "currency": "KES",
  "merchantId": "VNA",
  "orderId": "331625",
  "paymentItem": "PYC",
  "pin": "6897",
  "provider": "700",
  "terminalId": "3TLP0001",
  "terminalType": "MOBILE",
  "token": "10157192",
  "transactionRef": "100366690980"
     */
    ItemJSON = JSON.stringify({
        "country": "KE",
        "currency": "KES",
        "amount": amount,
        "orderId": orderId,
        "token": token,
        "pin": pin,
        "transactionRef": orderId,
        "terminalType": terminalType,
        "paymentItem": "PYC",
        "provider": "PYC",
        "merchantId": merchantId,
        "narration": "Payment",
        "fee": "0"
    });

    var redirecturl = '/merchant/payment/page/payment/update';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.open("POST", url1, false);
    xmlhttp.setRequestHeader("Authorization", authorization);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Signature", hexToBase64(Sha1.hash(signatureCipher)));
    xmlhttp.setRequestHeader("SignatureMethod", "SHA1");
    xmlhttp.setRequestHeader("Timestamp", timestamp);
    xmlhttp.setRequestHeader("Nonce", nonce);
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.send(ItemJSON);
    //alert(xmlhttp.responseText);
    //document.getElementById("div").innerHTML = xmlhttp.statusText + ":" + xmlhttp.status + "<BR><textarea rows='100' cols='100'>" + xmlhttp.responseText + "</textarea>";
    if (xmlhttp.status == "200") {
        alert("Payment Posted Successfully");
        $(location).attr("href", redirecturl + "?paymentRef=" + ref + "&status=00&channel=pyc");
        document.getElementById("div").innerHTML = "Payment Posted Successfully";
        document.getElementById("div1").innerHTML = "";

    } else {
        alert("Payment Failed");
        $(location).attr("href", redirecturl + "?paymentRef=" + ref + "&status=01&channel=pyc");
        document.getElementById("div").innerHTML = "";
        document.getElementById("div1").innerHTML = "Payment Failed";
    }

}

function sendCard() {
    var httpMethod = "POST";
    var url1 = "http://172.16.112.4:9080/api/v1/merchant/transact/cards";
    var url = "http://172.16.112.4:9080/api/v1/merchant/transact/cards";
    url = url.replace("http://", "https://");
    url = encodeURIComponent(url);

    var timestamp = Date.now() / 1000 | 0;
    var nonce = guid();
    var clientId = "IKIAB8FA9382D1FAC6FCA2F30195029B0A1558A9FECA";
    var authorization = "InterswitchAuth" + " " + b64EncodeUnicode(clientId);
    var clientSecret = "dxdmtf12FhLVIFRz8IzhnuAJzNd6AAFVgx/3LlJHc+4=";


    var signatureCipher = httpMethod + "&" + url + "&" + timestamp + "&" + nonce + "&" + clientId + "&" + clientSecret;

    var ItemJSON;

    //ItemJSON = '[  {    "Id": 1,    "ProductID": "1",    "Quantity": 1,  },  {    "Id": 1,    "ProductID": "2",    "Quantity": 2,  }]';

    var amount = $('.amount').text();
    var orderId = $('.orderId').text();
    var terminalType = $('.terminalType').text();
    var merchantId = $('.merchantId').text();
    var cardNumber = $.trim($('#Editbox1').val());
    var expiry = $.trim($('#Editbox2').val());
    var cvv = $.trim($('#Editbox3').val());

    alert(cardNumber + "-" + expiry + "-" + cvv);

    ItemJSON = JSON.stringify({
        "country": "KE",
        "currency": "KES",
        "amount": amount,
        "orderId": orderId,
        "phone": "254713167623",
        "transactionRef": orderId,
        "terminalType": terminalType,
        "paymentItem": "MMO",
        "provider": "703",
        "merchantId": merchantId,
        "callBackUrl": "webpaycallback",
        "isLog": "0",
        "narration": "Payment",
        "fee": "25"
    });


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.open("POST", url1, false);
    xmlhttp.setRequestHeader("Authorization", authorization);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Signature", hexToBase64(Sha1.hash(signatureCipher)));
    xmlhttp.setRequestHeader("SignatureMethod", "SHA1");
    xmlhttp.setRequestHeader("Timestamp", timestamp);
    xmlhttp.setRequestHeader("Nonce", nonce);
    xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
    xmlhttp.send(ItemJSON);
    alert(xmlhttp.responseText);
    //document.getElementById("div").innerHTML = xmlhttp.statusText + ":" + xmlhttp.status + "<BR><textarea rows='100' cols='100'>" + xmlhttp.responseText + "</textarea>";
    if (xmlhttp.status == "200") {
        alert("Payment Posted Successfully");
        document.getElementById("div").innerHTML = "Payment Posted Successfully";
        document.getElementById("div1").innerHTML = "";

    } else {
        alert("Payment Failed");
        document.getElementById("div").innerHTML = "";
        document.getElementById("div1").innerHTML = "Payment Failed";

    }
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