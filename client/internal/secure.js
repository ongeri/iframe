//import SECURE_CONFIG from './secure.config';

var forge = require('node-forge');

//var SECURE_CONFIG = require('./secure.config');
var SECURE_CONFIG = {
    PUBLIC_KEY_EXPONENTS: "010001",
    PUBLIC_KEY_MODULES: "009c7b3ba621a26c4b02f48cfc07ef6ee0aed8e12b4bd11c5cc0abf80d5206be69e1891e60fc88e2d565e2fabe4d0cf630e318a6c721c3ded718d0c530cdf050387ad0a30a336899bbda877d0ec7c7c3ffe693988bfae0ffbab71b25468c7814924f022cb5fda36e0d2c30a7161fa1c6fb5fbd7d05adbef7e68d48f8b6c5f511827c4b1c5ed15b6f20555affc4d0857ef7ab2b5c18ba22bea5d3a79bd1834badb5878d8c7a4b19da20c1f62340b1f7fbf01d2f2e97c9714a9df376ac0ea58072b2b77aeb7872b54a89667519de44d0fc73540beeaec4cb778a45eebfbefe2d817a8a8319b2bc6d9fa714f5289ec7c0dbc43496d71cf2a642cb679b0fc4072fd2cf"
};

var SecureManager = {};


var Randomize = function () {
    return Math.random();
}


SecureManager.getNewPinData = function (pin, pinKey) {
    var clearPINBlock = "1" + String(pin).length + String(pin);
    var randomNumber = Math.floor(Randomize() * 10);
    var pinPadLen = 14 - String(pin).length;
    for (var i = 0; i < pinPadLen; i++) {
        clearPINBlock = clearPINBlock + String(randomNumber);
    }
    var iv = 0x00;
    iv = forge.util.hexToBytes(iv);
    var pinKeyBuffer = forge.util.createBuffer(pinKey);
    pinKeyBuffer.putBytes(pinKey);
    pinKey = pinKeyBuffer.getBytes(24);

    var cipher = forge.cipher.createCipher('3DES-CBC', pinKey);
    var clearPINBlockBytes = forge.util.hexToBytes(clearPINBlock);

    cipher.start({
        iv: iv
    });
    cipher.update(forge.util.createBuffer(clearPINBlockBytes));
    cipher.finish();
    var encrypted = cipher.output;
    var encryptedPinBlock = String(encrypted.toHex());
    return encryptedPinBlock.substring(0, 16);

};

SecureManager.getPinBlock = function (pin, cvv2, expiryDate, pinKey, randNum) {
    if (!pin) {
        pin = "FFFF"; //"0000"
    }
    if (!cvv2) {
        cvv2 = "FFF"; // 000
    }
    if (!expiryDate) {
        expiryDate = "0000";
    }

    var pinBlockString = pin + cvv2 + expiryDate;
    var pinBlockStringLen = pinBlockString.length;
    var pinBlockStringLenLen = String(pinBlockStringLen).length;
    var clearPinBlock = String(pinBlockStringLenLen) + String(pinBlockStringLen) + pinBlockString;

    var randomNumber = randNum;

    var pinpadlen = 16 - clearPinBlock.length;
    for (var i = 0; i < pinpadlen; i++) {
        clearPinBlock = clearPinBlock + randomNumber;
    }

    var iv = 0x00;
    iv = forge.util.hexToBytes(iv);
    var pinKeyBuffer = forge.util.createBuffer(pinKey);
    pinKeyBuffer.putBytes(pinKey);
    pinKey = pinKeyBuffer.getBytes(24);

    var cipher = forge.cipher.createCipher('3DES-CBC', pinKey);
    var clearPINBlockBytes = forge.util.hexToBytes(clearPinBlock);

    cipher.start({
        iv: iv
    });
    cipher.update(forge.util.createBuffer(clearPINBlockBytes));
    cipher.finish();
    var encrypted = cipher.output;
    var encryptedPinBlock = String(encrypted.toHex());
    return encryptedPinBlock.substring(0, 16);

};


SecureManager.generateKey = function () {
    var bytes = forge.random.getBytesSync(16);
    return bytes;
};


SecureManager.isValueSet = function (value) {

    if (value !== null && value !== "" && value !== "undefined") {
        return true;
    } else {
        return false;
    }
};


SecureManager.padRight = function (value, maxLen) {
    var maxLength = parseInt(maxLen);
    var stringValue = String(value);
    if (!SecureManager.isValueSet(stringValue) || stringValue.length >= maxLength) {
        return stringValue;
    }
    var length = stringValue.length;
    var deficitLength = maxLength - length;
    for (var i = 0; i < deficitLength; i++) {
        stringValue += "0";
    }
    return stringValue;
};

SecureManager.padLeft = function (value, maxLen) {
    var maxLength = parseInt(maxLen);
    var stringValue = String(value);
    if (!SecureManager.isValueSet(stringValue) || stringValue.length >= maxLength) {
        return stringValue;
    }
    var length = stringValue.length;
    var deficitLength = maxLength - length;
    for (var i = 0; i < deficitLength; i++) {
        stringValue = "0" + stringValue;
    }
    return stringValue;
};

SecureManager.getMacData = function (app, options) {
    var macData = "";
    if (!SecureManager.isValueSet(app)) {
        return macData;
    }
    if (SecureManager.isValueSet(options.tid)) {
        macData += String(options.tid);
    }

    if (SecureManager.isValueSet(options.cardName)) {
        macData += options.cardName;
    }
    if (SecureManager.isValueSet(options.ttid)) {
        macData += String(options.ttid);
    }

    if (SecureManager.isValueSet(options.amount)) {
        macData += String(options.amount);
    }

    if (!SecureManager.isValueSet(options.additionalInfo)) {
        return macData;
    }

    if (SecureManager.isValueSet(options.additionalInfo.transferInfo)) {
        if (SecureManager.isValueSet(options.additionalInfo.transferInfo.toAccountNumber)) {
            macData += options.additionalInfo.transferInfo.toAccountNumber;
        }

        if (SecureManager.isValueSet(options.additionalInfo.transferInfo.toBankCode)) {
            macData += options.additionalInfo.transferInfo.toBankCode;
        }
    }

    if (SecureManager.isValueSet(options.additionalInfo.billInfo)) {
        if (SecureManager.isValueSet(options.additionalInfo.billInfo.phoneNumber)) {
            macData += options.additionalInfo.billInfo.phoneNumber;
        }
        if (SecureManager.isValueSet(options.additionalInfo.billInfo.customerNumber)) {
            macData += options.additionalInfo.billInfo.customerNumber;
        }

        if (SecureManager.isValueSet(options.additionalInfo.billInfo.billCode)) {
            macData += options.additionalInfo.billInfo.billCode;
        }

    }

    if (SecureManager.isValueSet(options.additionalInfo.rechargeInfo)) {
        if (SecureManager.isValueSet(options.additionalInfo.rechargeInfo.tPhoneNumber)) {
            macData += options.additionalInfo.rechargeInfo.tPhoneNumber;
        }
        if (SecureManager.isValueSet(options.additionalInfo.rechargeInfo.productionCode)) {
            macData += options.additionalInfo.rechargeInfo.productionCode;
        }

    }

    if (SecureManager.isValueSet(options.additionalInfo.atmTransferInfo)) {
        if (SecureManager.isValueSet(options.additionalInfo.atmTransferInfo.customerId)) {
            var custId = String(options.additionalInfo.atmTransferInfo.customerId);
            macData += custId;
        }
        if (SecureManager.isValueSet(options.additionalInfo.atmTransferInfo.institutionCode)) {
            macData += options.additionalInfo.atmTransferInfo.institutionCode;
        }

    }
    return macData;
};

SecureManager.strToBytes = function (str) {
    var bytes = [];
    var charCode;

    for (var i = 0; i < str.length; ++i) {
        charCode = str.charCodeAt(i);
        bytes.push((charCode & 0xFF00) >> 8);
        bytes.push(charCode & 0xFF);
    }
    return bytes;

};
SecureManager.getMac = function (macData, macKey) {
    //do hmac here
    var hmac = forge.hmac.create();
    hmac.start('sha256', macKey);
    hmac.update(macData);
    return hmac.digest().toHex();
};

exports.authData = function (options) {

    //TODO Temporary Activate eCash

    var authString = "1Z" + options.card + 'Z' + options.pin + 'Z' + options.exp + 'Z' + options.cvv;
    //console.log("Auth-string: "+authString);
    var vv = SecureManager.toHex(authString);
    //var vv = SecureManager.toHex(options.authData);
    //console.log("vv: "+vv);
    var authDataBytes = forge.util.hexToBytes(vv);
    var clearSecureBytes = forge.util.createBuffer();

    var rsa = forge.pki.rsa;
    var modulos = new forge.jsbn.BigInteger(options.publicKeyModulus, 16);
    var exp = new forge.jsbn.BigInteger(options.publicKeyExponent, 16);
    var publicKey = rsa.setPublicKey(modulos, exp);

    //var pexp = new forge.jsbn.BigInteger('', 16);
    //var privateKey = rsa.setPrivateKey(modulos, pexp);

    clearSecureBytes.putBytes(authDataBytes);
    var vvvv = clearSecureBytes.getBytes();

    // console.log("Clear secure: "+forge.util.bytesToHex(vvvv));

    var authBytes = publicKey.encrypt(vvvv);
    var auth = forge.util.encode64(authBytes);
    //console.log("Auth-hex: "+auth);

    //var dauth = privateKey.decrypt(auth, 'RSAES-PKCS1-V1_5');
    //console.log("dauth-hex: "+dauth);

    return auth;

};

SecureManager.authDataKE = function (options, pan, pin, expiry, cvv) {

    //TODO Temporary Activate eCash

    //String authDataCipher = pan + "D" + cvv2 + "D" + expiryDate + "D" + pin ;
    let authString;
    if (options.cardvstokenradio === 'token') {
        authString = pan + ',' + cvv + ',' + expiry + ',' + pin;
    } else {
        authString = pan + 'D' + cvv + 'D' + expiry + 'D' + pin + "D" + options.tokenize;
    }
    console.log("Auth-string: " + authString);
    var vv = SecureManager.toHex(authString);
    //var vv = SecureManager.toHex(options.authData);
    //console.log("vv: "+vv);
    var authDataBytes = forge.util.hexToBytes(vv);
    var clearSecureBytes = forge.util.createBuffer();

    var rsa = forge.pki.rsa;
    var modulos = new forge.jsbn.BigInteger(options.publicKeyModulus, 16);
    var exp = new forge.jsbn.BigInteger(options.publicKeyExponent, 16);

    var modulos = new forge.jsbn.BigInteger("9c7b3ba621a26c4b02f48cfc07ef6ee0aed8e12b4bd11c5cc0abf80d5206be69e1891e60fc88e2d565e2fabe4d0cf630e318a6c721c3ded718d0c530cdf050387ad0a30a336899bbda877d0ec7c7c3ffe693988bfae0ffbab71b25468c7814924f022cb5fda36e0d2c30a7161fa1c6fb5fbd7d05adbef7e68d48f8b6c5f511827c4b1c5ed15b6f20555affc4d0857ef7ab2b5c18ba22bea5d3a79bd1834badb5878d8c7a4b19da20c1f62340b1f7fbf01d2f2e97c9714a9df376ac0ea58072b2b77aeb7872b54a89667519de44d0fc73540beeaec4cb778a45eebfbefe2d817a8a8319b2bc6d9fa714f5289ec7c0dbc43496d71cf2a642cb679b0fc4072fd2cf", 16);
    var exp = new forge.jsbn.BigInteger("010001", 16);

    var publicKey = rsa.setPublicKey(modulos, exp);

    //var pexp = new forge.jsbn.BigInteger('', 16);
    //var privateKey = rsa.setPrivateKey(modulos, pexp);

    clearSecureBytes.putBytes(authDataBytes);
    var vvvv = clearSecureBytes.getBytes();

    console.log("Clear secure: " + forge.util.bytesToHex(vvvv));

    var authBytes = publicKey.encrypt(vvvv);
    var auth = forge.util.encode64(authBytes);
    console.log("Auth-hex: " + auth);

    //var dauth = privateKey.decrypt(auth, 'RSAES-PKCS1-V1_5');
    //console.log("dauth-hex: "+dauth);

    return auth;
};

SecureManager.getSecure = function (options, app, isActivate) {
    //TODO Temporary Activate eCash
    var version = "12";
    version = (isActivate) ? "10" : version;

    var headerBytes = forge.util.hexToBytes("4D");
    var formatVersionBytes = forge.util.hexToBytes(version);
    var macVersionBytes = forge.util.hexToBytes(version);
    var pinDesKey = options.pinKey;
    var macDesKey = options.macKey;
    var customerIdBytes;
    var otherBytes;

    if (SecureManager.isValueSet(options.pan)) {
        var customerId = String(options.pan);
        var customerIdLen = String(customerId.length);
        var customerIdLenLen = customerIdLen.length;
        var customerIdBlock = String(customerIdLenLen) + customerIdLen + customerId;
        var customerIdBlockLen = customerIdBlock.length;
        var pandiff = 40 - parseInt(customerIdBlockLen);
        for (var i = 0; i < pandiff; i++) {
            customerIdBlock += "F";
        }
        customerIdBytes = forge.util.hexToBytes(SecureManager.padRight(customerIdBlock, 40));
        // console.log(forge.util.bytesToHex(customerIdBytes));

    }
    // console.log(pinDesKey);
    // console.log(forge.util.bytesToHex(headerBytes));
    // console.log(forge.util.bytesToHex(pinDesKey));
    // console.log(forge.util.bytesToHex(formatVersionBytes));
    // console.log(forge.util.bytesToHex(macVersionBytes));
    var otherString = "00000000";
    otherBytes = forge.util.hexToBytes(otherString);

    var macData = SecureManager.getMacData(app, options);
    // console.log("MacData : " + macData);
    var mac = SecureManager.getMac(macData, macDesKey);
    var macBytes = forge.util.hexToBytes(mac);
    // console.log("machex : "+mac);
    var footerBytes = forge.util.hexToBytes("5A");

    var clearSecureBytes = forge.util.createBuffer();

    clearSecureBytes.putBytes(headerBytes);
    // console.log("Headerbytes-lenght : "+headerBytes.length);
    clearSecureBytes.putBytes(formatVersionBytes);
    // console.log("formatVersionBytes-lenght : "+formatVersionBytes.length);
    clearSecureBytes.putBytes(macVersionBytes);
    // console.log("macVersionBytes-lenght : "+macVersionBytes.length);
    clearSecureBytes.putBytes(pinDesKey);
    // console.log("pinDesKey-lenght : "+pinDesKey.length);
    clearSecureBytes.putBytes(macDesKey);
    // console.log("macDesKey-lenght : "+macDesKey.length);
    clearSecureBytes.putBytes(customerIdBytes);
    macBytes = forge.util.hexToBytes("00000000");
    // console.log("customerIdBytes-lenght : "+customerIdBytes.length);
    clearSecureBytes.putBytes(macBytes);
    // console.log("macBytes-lenght : "+macBytes.length);

    clearSecureBytes.putBytes(otherBytes);
    // console.log("otherBytes-lenght : "+otherBytes.length);
    clearSecureBytes.putBytes(footerBytes);
    // console.log("footerBytes-lenght : "+footerBytes.length);
    var rsa = forge.pki.rsa;
    var modulos = new forge.jsbn.BigInteger(SECURE_CONFIG.PUBLIC_KEY_MODULES, 16);
    var exp = new forge.jsbn.BigInteger(SECURE_CONFIG.PUBLIC_KEY_EXPONENTS, 16);
    var publicKey = rsa.setPublicKey(modulos, exp);

    var vvvv = clearSecureBytes.getBytes();

    // console.log("Clear secure: "+forge.util.bytesToHex(vvvv));

    var secureBytes = publicKey.encrypt(vvvv, null);
    var secureHex = forge.util.bytesToHex(secureBytes);
    // console.log("Secure-hex: "+secureHex);

    return secureHex;
};


exports.generateSecureData = function (options, pinData) {
    console.log("generating secure data " + JSON.stringify(options) + " " + JSON.stringify(pinData));
    var pinBlock, expiry, ttId, pinKey, secureOptions, macData, mac, secure, secureData, publicKeyModulus,
        publicKeyExponent;
    var pan, amt;
    expiry = options.expiry || '0000';
    pan = (options.pan == null || options.pan == '') ? '0000000000000000' : options.pan;
    pan = !options.pan || options.pan.replace(/\s/g, '');
    ttId = (options.ttId == null || options.ttId == '') ? (Math.floor(Randomize() * 900) + 100) : options.ttId;
    amt = (options.amount == null || options.amount == '') ? "" : options.amount;
    pinKey = SecureManager.generateKey();
    publicKeyModulus = options.publicKeyModulus != null ? options.publicKeyModulus : SECURE_CONFIG.PUBLIC_KEY_MODULES;
    publicKeyExponent = options.publicKeyExponent != null ? options.publicKeyExponent : SECURE_CONFIG.PUBLIC_KEY_EXPONENTS;

    secureOptions = {
        pinKey: pinKey,
        macKey: pinKey,
        tid: options.mobile,
        ttid: ttId.toString(),
        amount: amt,
        pan: pan,
        accountNumber: "",
        expiryDate: expiry,
        cardName: "default",
        publicKeyModulus: publicKeyModulus,
        publicKeyExponent: publicKeyExponent,
        additionalInfo: {
            transferInfo: {
                toAccountNumber: "",
                toBankCode: ""
            },
            rechargeInfo: {
                tPhoneNumber: "",
                productionCode: ""
            },
            billInfo: {
                phoneNumber: "",
                customerNumber: "",
                billCode: ""
            },
            atmTransferInfo: {
                customerId: "",
                transferCode: "",
                institutionCode: ""
            }
        }
    };

    secureData = SecureManager.getSecure(secureOptions, 'createcard');
    macData = SecureManager.getMacData('app', secureOptions);
    pinBlock = SecureManager.getPinBlock2(pinData.pin, pinData.cvv, pinData.expiry, pinKey, ttId);
    mac = SecureManager.getMac(macData, pinKey);

    return {secureData, pinBlock, mac};
}


var generateSecureData2 = (options, pinData) => {
    var pinBlock, expiry, pinKey, secureOptions, secure, secureData, macData;
    expiry = options.expiry || '0000';
    options.pan = !options.pan || options.pan.replace(/\s/g, '');
    pinKey = SecureManager.generateKey();
    secureOptions = {
        pinKey: pinKey,
        macKey: pinKey,
        publicKeyModulus: SECURE_CONFIG.PUBLIC_KEY_MODULES,
        publicKeyExponent: SECURE_CONFIG.PUBLIC_KEY_EXPONENTS,
        tid: options.mobile,
        ttid: options.ttid,
        amount: "",
        pan: "0000000000000000",
        accountNumber: "",
        expiryDate: '',
        cardName: "default",
        additionalInfo: {
            transferInfo: {
                toAccountNumber: "",
                toBankCode: ""
            },
            rechargeInfo: {
                tPhoneNumber: "",
                productionCode: ""
            },
            billInfo: {
                phoneNumber: "",
                customerNumber: "",
                billCode: ""
            },
            atmTransferInfo: {
                customerId: "",
                transferCode: "",
                institutionCode: ""
            }
        }
    };

    console.log(secureOptions);


    secureData = SecureManager.getSecure(secureOptions, 'createcard');
    macData = SecureManager.getMacData('app', secureOptions);
    pinBlock = getPinBlock(pinData.pin, pinData.cvv, pinData.expiry, pinKey, options.ttid)
    return {secureData, pinBlock, macData: SecureManager.getMac(macData, pinKey)};
};


exports.generateSecureDataKE = function (options, pinData) {
    console.log("generating secure data " + JSON.stringify(options) + " " + JSON.stringify(pinData));
    var pinBlock, expiry, ttId, pinKey, secureOptions, macData, mac, secure, secureData, publicKeyModulus,
        publicKeyExponent, authData;
    var pan, amt;
    expiry = options.expiry || '0000';
    pan = (options.pan == null || options.pan == '') ? '0000000000000000' : options.pan;
    pan = !options.pan || options.pan.replace(/\s/g, '');
    ttId = (options.ttId == null || options.ttId == '') ? (Math.floor(Randomize() * 900) + 100) : options.ttId;
    amt = (options.amount == null || options.amount == '') ? "" : options.amount;
    pinKey = SecureManager.generateKey();
    publicKeyModulus = options.publicKeyModulus != null ? options.publicKeyModulus : SECURE_CONFIG.PUBLIC_KEY_MODULES;
    publicKeyExponent = options.publicKeyExponent != null ? options.publicKeyExponent : SECURE_CONFIG.PUBLIC_KEY_EXPONENTS;

    secureOptions = {
        pinKey: pinKey,
        macKey: pinKey,
        tid: options.mobile,
        ttid: ttId.toString(),
        amount: amt,
        pan: pan,
        accountNumber: "",
        expiryDate: expiry,
        cardName: "default",
        publicKeyModulus: publicKeyModulus,
        publicKeyExponent: publicKeyExponent,
        additionalInfo: {
            transferInfo: {
                toAccountNumber: "",
                toBankCode: ""
            },
            rechargeInfo: {
                tPhoneNumber: "",
                productionCode: ""
            },
            billInfo: {
                phoneNumber: "",
                customerNumber: "",
                billCode: ""
            },
            atmTransferInfo: {
                customerId: "",
                transferCode: "",
                institutionCode: ""
            }
        }
    };

    secureData = SecureManager.getSecure(secureOptions, 'createcard');
    macData = SecureManager.getMacData('app', secureOptions);
    pinBlock = SecureManager.getPinBlock2(pinData.pin, pinData.cvv, pinData.expiry, pinKey, ttId);
    mac = SecureManager.getMac(macData, pinKey);

    //authData = authDataKE(pan, pinData.pin, pinData.expiry, pinData.cvv);
    authData = SecureManager.authDataKE(options, pan, pinData.pin, pinData.expiry, pinData.cvv);

    return {secureData, pinBlock, mac, authData};
}


exports.generateHeadersKE = function (client, url, httpMethod) {
    console.log("generating header data " + JSON.stringify(client));

    var timestamp, nonce, authorization, signatureCipher, signature, signatureMethod, httpMethod, headerOptions;
    var clientId, clientSecret, url, contentType;

    clientId = client._configuration.clientId;
    clientSecret = client._configuration.clientSecret;
    url = url;
    httpMethod = httpMethod;

    url = url.replace("http://", "https://");
    url = encodeURIComponent(url);

    console.log("clientID = " + clientId);
    console.log("clientSecret = " + clientSecret);
    console.log("url = " + url);


    contentType = "application/json";
    timestamp = Date.now() / 1000 | 0;
    nonce = SecureManager.guid();
    authorization = "InterswitchAuth" + " " + SecureManager.b64EncodeUnicode(clientId);
    signatureCipher = httpMethod + "&" + url + "&" + timestamp + "&" + nonce + "&" + clientId + "&" + clientSecret;
    signature = SecureManager.hexToBase64(SecureManager.hash(signatureCipher));
    signatureMethod = "SHA1";

    headerOptions = {
        //Content-Type: contentType,
        Timestamp: timestamp,
        Nonce: nonce,
        Authorization: authorization,
        Signature: signature,
        SignatureMethod: signatureMethod
    };

    return headerOptions;
}


SecureManager.toHex = function (str) {

    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;

};

SecureManager.getPinBlock2 = function (pin, cvv2, expiryDate, pinKey, randNum) {
    if (!pin) {
        pin = "0000";
    }
    if (!cvv2) {
        cvv2 = "000";
    }
    if (!expiryDate) {
        expiryDate = "0000";
    }

    var pinBlockString = pin + cvv2 + expiryDate;
    var pinBlockStringLen = pinBlockString.length;
    var pinBlockStringLenLen = String(pinBlockStringLen).length;
    var clearPinBlock = String(pinBlockStringLenLen) + String(pinBlockStringLen) + pinBlockString;

    var randomNumber = randNum;

    var pinpadlen = 16 - clearPinBlock.length;
    for (var i = 0; i < pinpadlen; i++) {
        clearPinBlock = clearPinBlock + randomNumber;
    }

    var iv = 0x00;
    iv = forge.util.hexToBytes(iv);
    var pinKeyBuffer = forge.util.createBuffer(pinKey);
    pinKeyBuffer.putBytes(pinKey);
    pinKey = pinKeyBuffer.getBytes(24);

    var cipher = forge.cipher.createCipher('3DES-CBC', pinKey);
    var clearPINBlockBytes = forge.util.hexToBytes(clearPinBlock);

    cipher.start({
        iv: iv
    });
    cipher.update(forge.util.createBuffer(clearPINBlockBytes));
    cipher.finish();
    var encrypted = cipher.output;
    var encryptedPinBlock = String(encrypted.toHex());
    return encryptedPinBlock.substring(0, 16);

};

var getPinBlock = (pin, cvv, expiry, pinKey, ttId) => {
    var pinBlock;
    pin = pin || 'FFFF';
    cvv = cvv || 'FFF';
    expiry = expiry || '0000'
    return pinBlock = SecureManager.getPinBlock(pin, cvv, expiry, pinKey, ttId);
}

var generateKey = () => {
    SecureManager.generateKey();
}

//kenya

SecureManager.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + s4() + s4() +
        s4() + s4() + s4() + s4();
}

SecureManager.timestamp = function () {
    //return Date.now() / 1000 | 0;
    return Math.floor(Date.now() / 1000);
}

/**
 * Generates SHA-1 hash of string.
 *
 * @param {string} msg - (Unicode) string to be hashed.
 * @returns {string} Hash of msg as hex character string.
 */
SecureManager.hash = function (msg) {
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
        for (var t = 16; t < 80; t++) W[t] = SecureManager.ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
        // 2 - initialise five working variables a, b, c, d, e with previous hash value
        a = H0;
        b = H1;
        c = H2;
        d = H3;
        e = H4;
        // 3 - main loop
        for (var t = 0; t < 80; t++) {
            var s = Math.floor(t / 20); // seq for blocks of 'f' functions and 'K' constants
            var T = (SecureManager.ROTL(a, 5) + SecureManager.f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff;
            e = d;
            d = c;
            c = SecureManager.ROTL(b, 30);
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
    return SecureManager.toHexStr(H0) + SecureManager.toHexStr(H1) + SecureManager.toHexStr(H2) +
        SecureManager.toHexStr(H3) + SecureManager.toHexStr(H4);
};

/**
 * Function 'f' [§4.1.1].
 * @private
 */
SecureManager.f = function (s, x, y, z) {
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
SecureManager.ROTL = function (x, n) {
    return (x << n) | (x >>> (32 - n));
};

/**
 * Hexadecimal representation of a number.
 * @private
 */
SecureManager.toHexStr = function (n) {
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
//if (typeof module != 'undefined' && module.exports) module.exports = SecureManager; // CommonJs export
SecureManager.hexToBase64 = function (str) {
    console.log("hexToBase64 data = " + str);
    return btoa(String.fromCharCode.apply(null,
        str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
}
SecureManager.b64EncodeUnicode = function (str) {
    console.log("b64EncodeUnicode data = " + str);
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

//};

//export default SecureManager;
