/**
 * assumes body is a json string
 */
module.exports = function (body) {
    try {
        body = JSON.parse(body);
    }
    catch (e) {

    }

    return body;
};