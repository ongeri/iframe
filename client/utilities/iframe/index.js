'use strict';

var setAttributes = require('./lib/set-attributes');
var defaultAttributes = require('./lib/default-attributes');
var assign = require('./lib/assign');

module.exports = function createFrame(options) {

    console.log("creating Iframe");

    //create an iframe element
    var iframe = document.createElement('iframe');

    var config = assign({}, defaultAttributes, options);

    if (config.style && typeof config.style !== 'string') {
        assign(iframe.style, config.style);
        delete config.style;
    }

    setAttributes(iframe, config);
    const resizer = document.createElement("script");
    resizer.text = 'setTimeout(() => {iFrameResize({log: true}, "#' + iframe.name + '")}, 5000);';
    document.body.appendChild(resizer);

    if (!iframe.getAttribute('id')) {
        iframe.id = iframe.name;
    }

    return iframe;
};
