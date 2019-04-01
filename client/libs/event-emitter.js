function EventEmitter() {
    this._events = {};
}

EventEmitter.prototype.on = function (event, callback) {
    if (this._events[event]) {
        this._events[event].push(callback);
    } else {
        this._events[event] = [callback];
    }
};

EventEmitter.prototype._emit = function (event) {
    var i, args;
    var callbacks = this._events[event];

    if (!callbacks) {
        return;
    }

    //the first argument to _emit is the event name so
    //remove it, that is why the index starts at one.
    args = Array.prototype.slice.call(arguments, 1);


    for (i = 0; i < callbacks.length; i++) {
        callbacks[i].apply(null, args);
    }
};

module.exports = EventEmitter;