import {
    getElementFriendlyName,
    elementHasParentsWithId,
    allowedEditElementsList,
    elementHasParentsWithTagName,
    elementHasParentsWithAttribute,
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";
import {nextTick} from "vue";
import axios from "axios";

export class MouseOverSectionHandle extends ElementHandle {

    public handleActionAddElementTop;
    public handleActionAddElementBottom;
    public handleActionSave;
    public handleActionReset;
    public handleMainElement;

    constructor(public liveEdit) {

        super(liveEdit);

        this.createElementHandle();
        this.addListener();

    }

    public createElementHandle() {

        const createElementHandle = this.iframeManager.document.createElement("div");
        createElementHandle.id = 'js-live-edit-section-handle';
        createElementHandle.innerHTML = '' +
            '<button type="button" class="js-live-edit-section-handle-action-add" id="js-live-edit-section-handle-action-add-top">Add section</button>' +
            '<button type="button" id="js-live-edit-section-handle-action-add-block"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg> Add Block</button>' +
            '' +
            '<div class="js-live-edit-section-handle-menu">' +
            '<button type="button">' +
            '<svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 20 20"><path d="M17.181 2.927a2.975 2.975 0 0 0-4.259-.054l-9.375 9.375a2.438 2.438 0 0 0-.656 1.194l-.877 3.95a.5.5 0 0 0 .596.597l3.927-.873a2.518 2.518 0 0 0 1.234-.678l9.358-9.358a2.975 2.975 0 0 0 .052-4.153Zm-3.552.653a1.975 1.975 0 1 1 2.793 2.793l-.671.671l-2.793-2.792l.671-.672Zm-1.378 1.38l2.793 2.792l-7.98 7.98a1.518 1.518 0 0 1-.744.409l-3.16.702l.708-3.183c.059-.267.193-.511.386-.704l7.997-7.996Z"/></svg> ' +
            'Edit Section' +
            '</button>' +
            '<button class="remove" type="button">' +
            '<svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 256 256"><path d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"/></svg> ' +
            'Remove ' +
            '</button>' +
            '<button id="js-live-edit-section-handle-action-reset" class="reset" type="button">' +
            '<svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 32 32"><path fill="currentColor" d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z"/></svg>' +
            'Reset ' +
            '</button>' +
            '<button id="js-live-edit-section-handle-action-save" class="save" type="button">' +
            '<svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z"/></svg> ' +
            'Save ' +
            '</button>' +
            '</div>' +
            '' +
            '<button type="button" class="js-live-edit-section-handle-action-add" id="js-live-edit-section-handle-action-add-bottom">Add section</button>';

        this.iframeManager.body.appendChild(createElementHandle);

        this.handleMainElement = this.iframeManager.document.getElementById('js-live-edit-section-handle');
        this.handleActionAddElementTop = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-add-top');
        this.handleActionAddElementBottom = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-add-bottom');
        this.handleActionSave = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-save');
        this.handleActionReset = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-reset');

        this.handleActionReset.addEventListener('click', () => {


        });

        this.handleActionSave.addEventListener('click', () => {

            let clickedElement = this.liveEdit.clickedElement;
            let getElementParentSectionElement = elementHasParentsWithAttribute(clickedElement, 'webesembly:section');
            if (!getElementParentSectionElement) {
                return;
            }

            let pageName = '';
            let getElementParentPageElement = elementHasParentsWithAttribute(clickedElement, 'webesembly:page');
            if (getElementParentPageElement) {
                pageName = getElementParentPageElement.getAttribute('webesembly:page');
            }

            let clonedHtmlSection = getElementParentSectionElement.innerHTML;
            clonedHtmlSection = this.liveEdit.handles.flexGridResizerHandle.clearHtml(clonedHtmlSection);

            axios.post('/webesembly/save-section', {
                'name':getElementParentSectionElement.getAttribute('webesembly:section'),
                'html':clonedHtmlSection,
                'pageName':pageName
            }).then(() => {
                alert('Промените са запазени!');
            }).catch(error => {
                alert('Възникна грешка при запазването на промените!');
            });

        });
    }

    public addListener()
    {
        const app = this;
        app.iframeManager.document.addEventListener('mouseover', e => {
            app.handleMainElement.style.display = 'none';
            let mouseOverElement = app.iframeManager.document.elementFromPoint(e.clientX, e.clientY);
            if (mouseOverElement) {

                let getElementParentSectionElement = elementHasParentsWithAttribute(mouseOverElement, 'webesembly:section');
                if (!getElementParentSectionElement) {
                    return;
                }

                app.handleMainElement.style.width = (getElementParentSectionElement.offsetWidth) + 'px';
                app.handleMainElement.style.height = (getElementParentSectionElement.offsetHeight) + 'px';

                let mouseOverElementBounding = getElementParentSectionElement.getBoundingClientRect();
                app.handleMainElement.style.top = (mouseOverElementBounding.top + (app.iframeManager.window.scrollY)) + 'px';
                app.handleMainElement.style.left = (mouseOverElementBounding.left + (app.iframeManager.window.scrollX)) + 'px';

                app.handleMainElement.style.display = 'block';


            }
        }, {passive: true});
    }

    public hide()
    {
        this.handleMainElement.style.display = 'none';
    }

}
