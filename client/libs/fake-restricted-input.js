function FakeRestrictedInput(options) {
    this.inputElement = options.element;
}

FakeRestrictedInput.prototype.getUnformattedValue = function () {
    return this.inputElement.value;
};

FakeRestrictedInput.prototype.setValue = function (val) {
    this.inputElement.value = val;
};

FakeRestrictedInput.prototype.setPattern = function () {
};

module.exports = FakeRestrictedInput;