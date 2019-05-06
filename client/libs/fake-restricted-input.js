const constants = require('../libs/constants.js');

function FakeRestrictedInput(options) {
    this.inputElement = options.element;
}

FakeRestrictedInput.prototype.getUnformattedValue = function () {
    if (this.inputElement.attributes.name.value === constants.formMap.cardvstokenradio.name) {
        return document.querySelector('input[name="' + constants.formMap.cardvstokenradio.name + '"]:checked').value
    }
    return this.inputElement.value;
};

FakeRestrictedInput.prototype.setValue = function (val) {
    this.inputElement.value = val;
};

FakeRestrictedInput.prototype.setPattern = function () {
};

module.exports = FakeRestrictedInput;
