const validation = function (isValid, isPotentiallyValid) {
    return {
        isValid: isValid,
        isPotentiallyValid: isPotentiallyValid
    };
};

const check = function (value) {
    return validation(true, true);
};

module.exports = check;
