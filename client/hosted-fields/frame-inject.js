module.exports = function (frame, container) {

    var clearboth = document.createElement('div');

    var fragment = document.createDocumentFragment();

    clearboth.style.clear = 'both';

    fragment.appendChild(frame);
    fragment.appendChild(clearboth);

    container.appendChild(fragment);
    return [frame, container];
};
