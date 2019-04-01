var DEFAULT_MAX = 3;


var validation = function (isValid, isPotentiallyValid) {
    return {
        isValid: isValid,
        isPotentiallyValid: isPotentiallyValid
    };
};

var isMemberOf = function (value, arr) {

    var i = 0;

    for (; i < arr.length; i++) {
        if (arr[i] === value) return true;
    }
    return false;
};
var check = function (value, maxlen) {
    maxlen = maxlen || DEFAULT_MAX;
    maxlen = maxlen instanceof Array ? maxlen : [maxlen];

    if (!(typeof value === 'string')) {
        //there is no way for it to be correct because it is
        //a string
        return validation(false, false);
    }
    if (!/^\d*$/.test(value)) {
        //it is not composed entirely of digits
        return validation(false, false);
    }
    if (isMemberOf(value.length, maxlen)) {
        //is a digit seq, is of the right length
        return validation(true, true);
    }
    if (value.length < Math.min.apply(null, maxlen)) {

        //even though not complete, have a good prefix
        return validation(false, true);
    }
    if (value.length > Math.max.apply(null, maxlen)) {

        //this is when the length is too long
        return validation(false, false);
    }

    //i find no other reason why you will be bad 
    return validation(true, true);

};

module.exports = check;