var querify = function(url, params) {

    url = url || '';

    if(params != null && typeof params === 'object' && _notEmpty(params)) {
        url += url.indexOf("?") === -1 ? "?" : "";
        url += url.indexOf("=") !== -1 ? "&" : "";
        url += stringify(params);
    }

    return url;
};


//recursive DFS on a json string with O(N) memory
// O(N+M) time processing function. Fast enough
var stringify = function(obj, namespace) {
    var k,v,p;
    var query = [];

    for(p in obj) {

        if(!obj.hasOwnProperty(p)) {
            continue;
        }

        v = obj[p];

        if(namespace) {

            //if array, change k
            if(_isArray(obj) ) {
                k = namespace + '[]';
            }
            //else obj so change k
            else {
                k = namespace +'['+p+']';
            }


        }
        else {
            k = p;
        }

        
        if(typeof v === 'object') {
            query.push(stringify(v, k));
        }else {
            query.push(encodeURIComponent(k)+"="+encodeURIComponent(v));
        }
    }
    console.log("final query "+query.join("&"));
    return query.join("&");
};

var _isArray = function(value){

    return value && typeof value === 'object' && typeof value.length === 'number' &&
    Object.prototype.toString.call(value) === '[object Array]' || false;
}

/**
 * checks if an object is non empty
 */
var _notEmpty = function(obj) {
    var key;
    for(key in obj){
        if(obj.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
};

module.exports = {
    querify : querify,
    stringify: stringify
};