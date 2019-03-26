/**
 * element is HTML element
 * @returns array of classlist,
 * if the element does not exist,
 * return an empty array
 */
var _classOf = function (element) {
    if (element) {
        return element.className.trim().split(/\s+/);
    }

    return [];
};

var add = function (element) {


    var toAdd = Array.prototype.slice.call(arguments, 1);
    console.log("add class " + JSON.stringify(_classOf(element)));

    var className = _classOf(element).filter(function (c) {
        return toAdd.indexOf(c) === -1;
    }).concat(toAdd).join(' ');

    console.log("add class " + JSON.stringify(_classOf(element)));

    element.className = className;
};

var remove = function (element) {

    var toAdd = Array.prototype.slice.call(arguments, 1);

    console.log("remove class " + JSON.stringify(_classOf(element)));

    var className = _classOf(element).filter(function (c) {
        console.log("comparing " + toAdd + "-and-" + c + " " + toAdd.indexOf(c));
        return toAdd.indexOf(c) === -1;
    }).join(' ');

    console.log("remove class " + JSON.stringify(_classOf(element)));
    element.className = className;
};

var toggle = function (element, className, adding) {

    console.log("toggle " + className + " " + adding);
    if (adding) {
        add(element, className);
    }
    else {
        remove(element, className);
    }
};

module.exports = {
    add: add,
    remove: remove,
    toggle: toggle
};