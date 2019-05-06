var DEFAULT_MAX = 3;


var validation = function (isValid, isPotentiallyValid) {
    return {
        isValid: isValid,
        isPotentiallyValid: isPotentiallyValid
    };
};

var check = function (value) {
    return validation(true, true);
};

module.exports = check;
