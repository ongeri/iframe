var types = {};
var VISA = 'visa';
var MASTERCARD = 'master-card';
var VERVE = 'verve';
var CVV = 'CVV';

var cardMap = [
    VISA,
    MASTERCARD,
    VERVE
];

types[VISA] = {
    common: 'Visa',
    type: VISA,
    start: "4",
    prefixPattern: /^4$/,
    exactPattern: /^4\d*$/,
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: {
        name: CVV,
        size: 3
    }
};

/*types[MASTERCARD] = {
  common: 'MasterCard',
  type: MASTERCARD,
  start: "5",
  prefixPattern: /^(5|5[1-5]|2|22|222|222[1-9]|2[3-6]|27[0-1]|2720)$/,
  exactPattern: /^(5[1-5]|222[1-9]|2[3-6]|27[0-1]|2720)\d*$/,
  gaps: [4, 8, 12],
  lengths: [19],
  code: {
    name: CVV,
    size: 3
  }
};*/

types[VERVE] = {
    common: 'Verve',
    type: VERVE,
    start: "5061",
    prefixPattern: /^4$/,
    exactPattern: /^4\d*$/,
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: {
        name: CVV,
        size: 3
    }
};

types[MASTERCARD] = {
    common: 'MasterCard',
    type: MASTERCARD,
    start: "5",
    prefixPattern: /^4$/,
    exactPattern: /^4\d*$/,
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: {
        name: CVV,
        size: 3
    }
};

var clone = function (x) {

    var exactPattern, prefixPattern, ret;
    if (!x) {
        return null;
    }

    exactPattern = x.exactPattern.source;
    prefixPattern = x.prefixPattern.source;
    ret = JSON.parse(JSON.stringify(x));
    ret.exactPattern = exactPattern;
    ret.prefixPattern = prefixPattern;


    return ret;

};

/**
 * Given a pan prefix value,
 * what type of card is this?
 */
var Card = function (val) {
    var type, value, i;
    var prefixResults = [];
    var exactResults = [];
    if (!(typeof val === 'string' || val instanceof String)) {
        return [];
    }

    for (i = 0; i < cardMap.length; i++) {
        type = cardMap[i];
        value = types[type];


        if (val.length === 0) {
            prefixResults.push(clone(value));
            continue;
        }

        // if(value.exactPattern.test(val)){
        //     exactResults.push(clone(value));
        // }
        // else if(value.prefixPattern.test(val)){
        //     prefixResults.push(clone(value))
        // }
        if (value.start === val.charAt(0)) {
            exactResults.push(clone(value));
        }


        if (exactResults.length) {
        }
        else {
        }
    }
    return exactResults.length ? exactResults : prefixResults;

};

module.exports = Card;