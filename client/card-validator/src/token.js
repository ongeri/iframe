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
    if (typeof value === 'number') {
        value = String(value);
    }

    if (typeof value !== 'string') {
        return verification(null, false, false);
    }

    //replace dashes or spaces with empty space
    value = value.replace(/\-|\s/g, '');

    //if not a number return
    if (!/^\d*$/.test(value)) {
        return verification(null, false, false);
    }

    potentialTypes = getCardTypes(value);

    console.log("potential types " + JSON.stringify(potentialTypes));

    if (potentialTypes.length === 0) {
        return verification(null, false, false);
    }
    else if (potentialTypes.length !== 1) {
        return verification(null, true, false);
    }

    //there is just one card now
    cardType = potentialTypes[0];

    console.log("value used is " + value);
    //do a luhn check
    isValid = luhn(value);

    console.log("luhn check: " + isValid);

    maxLength = Math.max.apply(null, cardType.lengths);

    console.log("maxLength is: " + maxLength + "----" + (value.length < maxLength));

    for (i = 0; i < cardType.lengths.length; i++) {
        if (cardType.lengths[i] === value.length) {
            isPotentiallyValid = (value.length !== maxLength) || isValid;
            return verification(cardType, isPotentiallyValid, isValid);
        }
    }

    return verification(cardType, (value.length < maxLength), false);
};

module.exports = Token;
