
var types = {};
var VISA = 'visa';
var MASTERCARD = 'mastercard';
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
  patterns: ["4"],
  luhn: true,
  gaps: [4, 8, 12],
  lengths: [16, 18, 19],
  code: {
    name: CVV,
    size: 3
  }
};

types[VERVE] = {
  common: 'Verve',
  type: VERVE,
  start: "5",
  prefixPattern: /^5$/,
  exactPattern: /^5\d*$/,
  patterns: ["506","56"],
  gaps: [4, 8, 12],
  lengths: [16, 18, 19],
  luhn: false,
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
  patterns:["51", "52", "53", "54", "55", "22", "23", "24", "25", "26", "27"],
  luhn: true,
  gaps: [4, 8, 12],
  lengths: [16, 18, 19],
  code: {
    name: CVV,
    size: 3
  }
};


var clone = function(x){

    var exactPattern, prefixPattern, ret;
    if(!x) {return null;}

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
var Card = function(val){
    var type, value, i;
    var prefixResults = [];
    var exactResults = [];
    if (!(typeof val === 'string' || val instanceof String)) {
        return [];
    }

    for(i=0;i<cardMap.length;i++){
        type = cardMap[i];
        value = types[type];

        /**
         * If the length is zero, then give all the card types
         */
        if(val.length === 0) {
            prefixResults.push(clone(value));
            continue;
        }

        /**
         * iterate and fetch all matching cards
         */
        for(var j=0;j<value.patterns.length;j++) {
            var m1 = 0;
            var m2 = 0;
            var bad = false;

            while(m1 < val.length && m2 < value.patterns[j].length) {
                if(val.charAt(m1) == value.patterns[j].charAt(m2)) {
                    m1++;
                    m2++;
                }
                else {
                    bad = true;
                    break;
                }
            }
            if(bad) {
                continue;
            }else {
                exactResults.push(clone(value));
                break;
            }
        }

    }
    return exactResults.length ? exactResults : prefixResults;
    
};

module.exports = Card;