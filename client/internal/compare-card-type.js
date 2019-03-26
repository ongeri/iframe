var comp = function (a, b) {
    var aHash;

    if (a !== undefined && b === undefined) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    /**
     * {
     *  visa: true,
     *  mastercard: true,
     *  verve: true
     * }
     */
    aHash = a.reduce(function (accum, type) {
        accum[type.type] = true;
        return accum;
    }, {});

    return b.every(function (type) {
        return aHash.hasOwnProperty(type.type);
    });
};

module.exports = comp;