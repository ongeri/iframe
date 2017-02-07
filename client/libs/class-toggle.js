/**
 * element is HTML element
 * @returns array of classlist,
 * if the element does not exist,
 * return an empty array
 */
var _classOf = function(element){
    if(element) {
        return element.className.trim().split('/\s+/');
    }

    return [];
};

var add = function(element){


    var toAdd = Array.prototype.slice.call(arguments, 1);

    console.log("adding class "+toAdd);

    var className = _classOf(element).filter(function(c){
        return toAdd.indexOf(c) === -1;
    }).concat(toAdd).join(' ');

    console.log("final class name "+className);
    element.className = className;
};

var remove = function(element){

    var toAdd = Array.prototype.slice.call(arguments, 1);

    var className = _classOf(element).filter(function(c){
        return toAdd.indexOf(c) === -1;
    }).join(' ');

    element.className = className;
};

var toggle = function(element, className, adding){

    if(adding) {
        add(element, className);
    }
    else {
        remove(element, className);
    }
};

module.exports = {
    add:add,
    remove:remove,
    toggle:toggle
};