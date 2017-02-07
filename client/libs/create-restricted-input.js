var FakeRestrictedInput = require('./fake-restricted-input');
module.exports = function(options) {

    var shouldFormat = options.shouldFormat;
    
    return new FakeRestrictedInput(options);
};