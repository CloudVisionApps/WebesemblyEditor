import {
    getElementFriendlyName,
    elementHasParentsWithId,
    allowedEditElementsList,
    elementHasParentsWithTagName,
    elementHasParentsWithAttribute,
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

export class MouseOverHeaderHandle extends ElementHandle {

    public editHeader = false;
    public handleActionEditElement;
    public handleMainElement;

    constructor(public liveEdit) {

        super(liveEdit);

        this.createElementHandle();
        this.addListener();

    }

    public createElementHandle() {

        const createElementHandle = this.iframeManager.document.createElement("div");
        createElementHandle.id = 'js-live-edit-header-handle';
        createElementHandle.innerHTML = '' +
            '<div><button id="js-live-edit-header-handle-action-edit" type="button">EDIT SITE HEADER</button></div>' +
            '';

        this.iframeManager.body.appendChild(createElementHandle);
        this.handleMainElement = this.iframeManager.document.getElementById('js-live-edit-header-handle');
        this.handleActionEditElement = this.iframeManager.document.getElementById('js-live-edit-header-handle-action-edit');

        let app = this;
        app.handleMainElement.addEventListener('click', function (e) {
            e.stopPropagation();
            app.editHeader = true;
            app.handleMainElement.style.display = 'none';
        });
    }

    public addListener()
    {
        const app = this;
        app.iframeManager.document.addEventListener('mouseover', e => {
            app.handleMainElement.style.display = 'none';
            let mouseOverElement = app.iframeManager.document.elementFromPoint(e.clientX, e.clientY);
            if (mouseOverElement) {

                let getElementParentSectionElement = elementHasParentsWithTagName(mouseOverElement, 'header');
                if (!getElementParentSectionElement) {
                    app.editHeader = false;
                    return;
                }

                if (!app.editHeader) {
                    app.handleMainElement.style.width = (getElementParentSectionElement.offsetWidth) + 'px';
                    app.handleMainElement.style.height = (getElementParentSectionElement.offsetHeight) + 'px';

                    let mouseOverElementBounding = getElementParentSectionElement.getBoundingClientRect();
                    app.handleMainElement.style.top = (mouseOverElementBounding.top + (app.iframeManager.window.scrollY)) + 'px';
                    app.handleMainElement.style.left = (mouseOverElementBounding.left + (app.iframeManager.window.scrollX)) + 'px';

                    app.handleMainElement.style.display = 'block';
                }

            }
        }, {passive: true});
    }

    public hide()
    {
        this.handleMainElement.style.display = 'none';
    }

}
