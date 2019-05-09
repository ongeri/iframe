var getCardTypes = require('../../card-type');
var luhn = require('./luhn-10.js');

var verification = function (card, isPotentiallyValid, isValid) {
    return {
        card: card,
        isPotentiallyValid: isPotentiallyValid,
        isValid: isValid
    };

};
var Token = function (value) {

    var potentialTypes, cardType, isValid, i, maxLength, isPotentiallyValid;
    value = String(value);

    if (typeof value !== 'string') {
        return verification(null, false, false);
    }

    potentialTypes = getCardTypes(value);

    console.log("potential types " + JSON.stringify(potentialTypes));

    // if (potentialTypes.length === 0) {
    //     return verification(null, false, false);
    // }
    // else if (potentialTypes.length !== 1) {
    //     return verification(null, true, false);
    // }

    //there is just one card now
    // cardType = potentialTypes[0];

    console.log("value used is " + value);
    //do a luhn check
    isValid = luhn(value);

    console.log("luhn check: " + isValid);

    return verification(null, true, true);
};

module.exports = Token;
