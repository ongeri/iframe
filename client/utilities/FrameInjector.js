"use strict";
var FrameInjector = (function () {
    function FrameInjector(frame, container) {
        var containerElement = document.createElement('div');
        var fragment = document.createDocumentFragment();
        container.style.clear = "both";
        fragment.appendChild(frame);
        fragment.appendChild(containerElement);
        container.appendChild(fragment);
        return [frame, container];
    }

    return FrameInjector;
}());//IIFE
exports.FrameInjector = FrameInjector;
