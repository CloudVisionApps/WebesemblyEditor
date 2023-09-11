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

        var head = this.iframeManager.document.getElementsByTagName('head')[0];
        

        var styleCoreAppend = this.iframeManager.document.createElement('link');
        styleCoreAppend.href = `//cdn.quilljs.com/1.3.6/quill.core.css`;
        styleCoreAppend.rel = 'stylesheet';
        head.appendChild(styleCoreAppend);

        var dragselectAppend = this.iframeManager.document.createElement('script');
        dragselectAppend.src = `//cdn.quilljs.com/1.3.6/quill.js`;
        head.appendChild(dragselectAppend);

        var scriptDraggable = this.iframeManager.document.createElement('script');
        scriptDraggable.innerHTML = `
        window.webesemblyQwuillInstances = {};
        setTimeout(function() {
        let quillI = 0;
        document.querySelectorAll('[webesembly\\\\:editable]').forEach((editableElement) => {
             var quill = new Quill(editableElement, {
                  modules: {
                    toolbar: true
                  },
                theme: 'snow'
              });
            window.webesemblyQwuillInstances[quillI] = quill;
            quillI++;
        });
}, 600);
`;
        head.appendChild(scriptDraggable);


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

                let mouseOverFlexGridElement = elementHasParentsWithAttribute(mouseOverElement, 'webesembly:flex-grid-element');
                if (mouseOverFlexGridElement == this.liveEdit.draggedElement) {
                    this.hide();
                    return;
                }

                let mouseOverElementMainEditable = elementHasParentsWithAttribute(mouseOverElement, 'webesembly:editable');
                mouseOverElementMainEditable.classList.add('js-webesembly-element');

                app.handleMainElement.style.width = (mouseOverElementMainEditable.offsetWidth + 1) + 'px';
                app.handleMainElement.style.height = (mouseOverElementMainEditable.offsetHeight + 2) + 'px';

                let mouseOverElementBounding = mouseOverElementMainEditable.getBoundingClientRect();
                app.handleMainElement.style.top = (mouseOverElementBounding.top + (app.iframeManager.window.scrollY - 1)) + 'px';
                app.handleMainElement.style.left = (mouseOverElementBounding.left + (app.iframeManager.window.scrollX - 1)) + 'px';

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
