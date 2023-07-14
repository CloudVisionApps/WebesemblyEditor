import {
    getElementFriendlyName,
    allowedEditElementsList,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";

import {ElementHandle} from "./../ElementHandle";

export class MouseOverModuleHandle extends ElementHandle {

    public handleNameElement;
    public handleMainElement;

    constructor(public liveEdit) {

        super(liveEdit);

        this.createModuleHandle();
        this.addListener();

    }

    public createModuleHandle() {

        const createModuleHandle = this.iframeManager.document.createElement("div");
        createModuleHandle.id = 'js-live-edit-module-handle';
        createModuleHandle.innerHTML = '<div id="js-live-edit-module-handle-name">Loading module..</div>';

        this.iframeManager.body.appendChild(createModuleHandle);

        this.handleMainElement = this.iframeManager.document.getElementById('js-live-edit-module-handle');
        this.handleNameElement = this.iframeManager.document.getElementById('js-live-edit-module-handle-name');
    }

    public addListener()
    {
        const app = this;
        app.iframeManager.document.addEventListener('mouseover', e => {

            app.handleMainElement.style.display = 'none';

            let mouseOverElement = app.iframeManager.document.elementFromPoint(e.clientX, e.clientY);
            if (mouseOverElement) {

                let getElementParentModuleElement = elementHasParentsWithAttribute(mouseOverElement, 'webesembly:module');
                if (!getElementParentModuleElement) {
                    return;
                }

                this.liveEdit.mouseOverModule = getElementParentModuleElement;
                if (getElementParentModuleElement == this.liveEdit.clickedModule) {
                    return;
                }

                app.handleMainElement.style.width = (getElementParentModuleElement.offsetWidth + 20) + 'px';
                app.handleMainElement.style.height = (getElementParentModuleElement.offsetHeight + 20) + 'px';

                let mouseOverElementBounding = getElementParentModuleElement.getBoundingClientRect();
                app.handleMainElement.style.top = (mouseOverElementBounding.top + (app.iframeManager.window.scrollY - 10)) + 'px';
                app.handleMainElement.style.left = (mouseOverElementBounding.left + (app.iframeManager.window.scrollX - 10)) + 'px';
                app.handleMainElement.style.display = 'block';

                let moduleFriendlyName = getElementParentModuleElement.getAttribute('webesembly:module').toUpperCase();
                if (app.handleNameElement) {
                    app.handleNameElement.innerText = moduleFriendlyName;
                }

            }
        }, {passive: true});
    }

    public hide()
    {
        this.handleMainElement.style.display = 'none';
    }

}
