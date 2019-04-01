module.exports = function (fn) {
    return function () {

        var args = arguments;
        setTimeout(function () {
            fn.apply(null, args);
        }, 1);
    };
};