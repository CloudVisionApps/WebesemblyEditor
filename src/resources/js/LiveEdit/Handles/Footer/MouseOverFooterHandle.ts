import {
    getElementFriendlyName,
    elementHasParentsWithId,
    allowedEditElementsList,
    elementHasParentsWithTagName,
    elementHasParentsWithAttribute,
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

export class MouseOverFooterHandle extends ElementHandle {

    public editFooter = false;
    public handleActionEditElement;
    public handleMainElement;

    constructor(public liveEdit) {

        super(liveEdit);

        this.createElementHandle();
        this.addListener();

    }

    public createElementHandle() {

        const createElementHandle = this.iframeManager.document.createElement("div");
        createElementHandle.id = 'js-live-edit-footer-handle';
        createElementHandle.innerHTML = '' +
            '<div><button id="js-live-edit-footer-handle-action-edit" type="button">EDIT SITE FOOTER</button></div>' +
            '';

        this.iframeManager.body.appendChild(createElementHandle);
        this.handleMainElement = this.iframeManager.document.getElementById('js-live-edit-footer-handle');
        this.handleActionEditElement = this.iframeManager.document.getElementById('js-live-edit-footer-handle-action-edit');

        let app = this;
        app.handleMainElement.addEventListener('click', function (e) {
            e.stopPropagation();
            app.editFooter = true;
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

                let getElementParentSectionElement = elementHasParentsWithTagName(mouseOverElement, 'footer');
                if (!getElementParentSectionElement) {
                    if (this.liveEdit.clickedModule) {
                        return;
                    }
                    if (this.liveEdit.clickedElement) {
                        return;
                    }
                    app.editFooter = false;
                    return;
                }

                if (!app.editFooter) {
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
