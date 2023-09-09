import {
    getElementFriendlyName,
    elementHasParentsWithId,
    allowedEditElementsList,
    elementHasParentsWithAttribute
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

export class MouseOverElementHandle extends ElementHandle {

    public handleNameElement;
    public handleMainElement;

    constructor(public liveEdit) {

        super(liveEdit);

        this.createElementHandle();
        this.addListener();

    }

    public createElementHandle() {

        const createElementHandle = this.iframeManager.document.createElement("div");
        createElementHandle.id = 'js-webesembly-element-handle';
        createElementHandle.innerHTML = '<div id="js-webesembly-element-handle-name">Loading..</div>';

        this.iframeManager.body.appendChild(createElementHandle);

        this.handleMainElement = this.iframeManager.document.getElementById('js-webesembly-element-handle');
        this.handleNameElement = this.iframeManager.document.getElementById('js-webesembly-element-handle-name');
    }

    public addListener()
    {
        const app = this;
        app.iframeManager.document.addEventListener('mouseover', e => {

            app.handleMainElement.style.display = 'none';

            let mouseOverElement = app.iframeManager.document.elementFromPoint(e.clientX, e.clientY);
            if (mouseOverElement) {

                this.liveEdit.mouseOverElement = mouseOverElement;
                if (mouseOverElement == this.liveEdit.clickedElement) {
                    return;
                }

                if (!this.canIEditThisElement(mouseOverElement)) {
                    return;
                }

                let getElementParentSectionElement = elementHasParentsWithAttribute(mouseOverElement, 'webesembly:section');
                if (!getElementParentSectionElement) {
                    return;
                }

                if (mouseOverElement.hasAttribute('webesembly:flex-grid')) {
                    return;
                }

                let mouseOverElementMainEditable = elementHasParentsWithAttribute(mouseOverElement, 'webesembly:editable');

                mouseOverElementMainEditable.classList.add('js-webesembly-element');

                app.handleMainElement.style.width = (mouseOverElementMainEditable.offsetWidth + 10) + 'px';
                app.handleMainElement.style.height = (mouseOverElementMainEditable.offsetHeight + 10) + 'px';

                let mouseOverElementBounding = mouseOverElementMainEditable.getBoundingClientRect();
                app.handleMainElement.style.top = (mouseOverElementBounding.top + (app.iframeManager.window.scrollY - 5)) + 'px';
                app.handleMainElement.style.left = (mouseOverElementBounding.left + (app.iframeManager.window.scrollX - 5)) + 'px';

                if (app.handleNameElement) {
                    app.handleNameElement.innerText = getElementFriendlyName(mouseOverElement.tagName);
                }

                app.handleMainElement.style.display = 'block';

            }
        }, {passive: true});
    }

    public hide()
    {
        this.handleMainElement.style.display = 'none';
    }

}
