export class FrameInjector {
    constructor(frame: HTMLFrameElement, container: HTMLElement) {
        var containerElement = document.createElement('div');
        var fragment = document.createDocumentFragment();
        container.style.clear = "both";
        fragment.appendChild(frame);
        fragment.appendChild(containerElement);
        container.appendChild(fragment);
        return [frame, container];
    }
}