
var verification = function(isPotentiallyValid, isValid) {
    return {
        isPotentiallyValid: isPotentiallyValid,
        isValid: isValid
    };

};


var Pin = function(value){

    if(typeof value === 'number') {
        value = String(number);
    }
    
    if(typeof value !== 'string') {
        return verification(false, false);
    }

    //replace dashes or spaces with empty space
    value = value.replace(/\s/g, '');

    //if not a number return
    if (!/^\d*$/.test(value)) { return verification(false, false); }

    if(value.length == 0 ) {
        return verification(false, false);
    }
    if(value.length < 4) {
        return verification(true, false);
    }

    return verification(true, true);


};

module.exports = Pin;