var slice = Array.prototype.slice;

function EventedModel() {
    this._attributes = this.resetAttributes();
    this._listeners = {};
}

// TODO: What the heck does this do? It iterates over the properties of the passed object and then saves them in a local variable that is then lost for ever?
EventedModel.prototype.initialize = function (obj) {

    if (!obj) {
        return;
    }
    // This local variable will be lost after function finishes executing... was it meant to be returned or saved back to attributes?
    var traversal = this._attributes;


//    console.log(typeof obj);

    for (var key in obj) {

        if (obj.hasOwnProperty(key)) {
            traversal[key] = obj[key];
        }
    }

    // console.log("object after initialization is "+JSON.stringify(traversal));

};

EventedModel.prototype.get = function get(compoundKey) {
    var i, key, keys;
    var traversal = this._attributes;

    if (compoundKey == null) {
        return traversal;
    }

    keys = compoundKey.split('.');

    for (i = 0; i < keys.length; i++) {
        key = keys[i];

        if (!traversal.hasOwnProperty(key)) {
            return undefined; // eslint-disable-line
        }

        traversal = traversal[key];
    }

    return traversal;
};

/**
 * Set the value to compound key
 * If there is a change, trigger two events
 * one for the change in type and another for
 * a change of type:field
 */
EventedModel.prototype.set = function set(compoundKey, value) {
//    console.log("Setting " + compoundKey + " " + value);
    var i, key, keys;
    var traversal = this._attributes;

    keys = compoundKey.split('.');

    for (i = 0; i < keys.length - 1; i++) {
        key = keys[i];

        if (!traversal.hasOwnProperty(key)) {
            traversal[key] = {};
        }

        traversal = traversal[key];
    }
    key = keys[i];

    if (traversal[key] !== value) {
//        console.log('change ' + key + "'s old value: ", traversal[key], ' to new value: ' + value);
        traversal[key] = value;
        //the value associated with this field has just changed
        //this.emit('change');

        for (i = 1; i <= keys.length; i++) {
            key = keys.slice(0, i).join('.');
//            console.log('change:' + key + "----" + JSON.stringify(this.get(key)));
            this.emit('change:' + key, this.get(key));
        }
    }
};


EventedModel.prototype.on = function on(event, handler) {

    var listeners = this._listeners[event];

    if (!listeners) {
        this._listeners[event] = [handler];
    }
    else {
        this._listeners[event].push(handler);
    }

};


EventedModel.prototype.emit = function emit(event) {

    var i;
    var self = this;
    var args = arguments;

    var listeners = this._listeners[event];

    if (!listeners) {
        return;
    }

    for (i = 0; i < listeners.length; i++) {
        listeners[i].apply(self, slice.call(args, 1));
    }


};

EventedModel.prototype.resetAttributes = function resetAttributes() {
    return {};
};


module.exports = EventedModel;
