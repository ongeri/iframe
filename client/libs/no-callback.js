//throws an error if the callback is not a function
module.exports = function (callback, functionName) {
    if (typeof callback !== 'function') {
        throw new Error({
            message: functionName + ' must include a callback function.'
        });
    }
};