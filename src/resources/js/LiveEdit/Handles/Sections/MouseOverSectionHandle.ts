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
    public handleActionMoveElementUp;
    public handleActionMoveElementDown;
    public handleActionMoveElementFavorite;
    public handleActionMoveElementDuplicate;
    public handleActionRemove;
    public handleMainElement;
    public currentSectionElement;

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
            '<button class="button-action" type="button">' +
            '<svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 20 20"><path d="M17.181 2.927a2.975 2.975 0 0 0-4.259-.054l-9.375 9.375a2.438 2.438 0 0 0-.656 1.194l-.877 3.95a.5.5 0 0 0 .596.597l3.927-.873a2.518 2.518 0 0 0 1.234-.678l9.358-9.358a2.975 2.975 0 0 0 .052-4.153Zm-3.552.653a1.975 1.975 0 1 1 2.793 2.793l-.671.671l-2.793-2.792l.671-.672Zm-1.378 1.38l2.793 2.792l-7.98 7.98a1.518 1.518 0 0 1-.744.409l-3.16.702l.708-3.183c.059-.267.193-.511.386-.704l7.997-7.996Z"/></svg> ' +
            'Edit Section' +
            '</button>' +
            '<div class="js-live-edit-section-handle-menu-group">\n' +
            '<button id="js-live-edit-section-handle-action-duplicate" type="button">\n' +
            '    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 16.75H6A2.75 2.75 0 0 1 3.25 14V6A2.75 2.75 0 0 1 6 3.25h8A2.75 2.75 0 0 1 16.75 6v8A2.75 2.75 0 0 1 14 16.75Zm-8-12A1.25 1.25 0 0 0 4.75 6v8A1.25 1.25 0 0 0 6 15.25h8A1.25 1.25 0 0 0 15.25 14V6A1.25 1.25 0 0 0 14 4.75Z"/><path fill="currentColor" d="M18 20.75h-8A2.75 2.75 0 0 1 7.25 18v-2h1.5v2A1.25 1.25 0 0 0 10 19.25h8A1.25 1.25 0 0 0 19.25 18v-8A1.25 1.25 0 0 0 18 8.75h-2v-1.5h2A2.75 2.75 0 0 1 20.75 10v8A2.75 2.75 0 0 1 18 20.75Z"/></svg>\n' +
            '</button>\n' +
            '<button id="js-live-edit-section-handle-action-favorite" type="button">\n' +
            '    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"/></svg>\n' +
            '</button>\n' +
            '<button id="js-live-edit-section-handle-action-move-up" type="button">\n' +
            '    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 5v14m7-7l-7-7l-7 7"/></svg>\n' +
            '</button>\n' +
            '<button id="js-live-edit-section-handle-action-move-down" type="button">\n' +
            '    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19V5m-7 7l7 7l7-7"/></svg>\n' +
            '</button>\n' +
            '</div>' +
            '<button id="js-live-edit-section-handle-action-remove" class="button-action remove" type="button">' +
            '<svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 256 256"><path d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"/></svg> ' +
            'Remove ' +
            '</button>' +
            '</div>' +
            '' +
            '<button type="button" class="js-live-edit-section-handle-action-add" id="js-live-edit-section-handle-action-add-bottom">Add section</button>';

        this.iframeManager.body.appendChild(createElementHandle);

        this.handleMainElement = this.iframeManager.document.getElementById('js-live-edit-section-handle');
        this.handleActionAddElementTop = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-add-top');
        this.handleActionAddElementBottom = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-add-bottom');

        this.handleActionMoveElementDuplicate = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-duplicate');
        this.handleActionMoveElementDuplicate.addEventListener('click', () => {

            console.log('duplicate');

            let cloneSection = this.currentSectionElement.cloneNode(true);
            this.currentSectionElement.parentNode.appendChild(cloneSection);

            cloneSection.scrollIntoView({block: "center"});


        });

        this.handleActionMoveElementUp = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-move-up');
        this.handleActionMoveElementUp.addEventListener('click', () => {

            console.log('move up');

            if (this.currentSectionElement.previousElementSibling) {
                this.currentSectionElement.parentNode.insertBefore(this.currentSectionElement, this.currentSectionElement.previousElementSibling);

                this.currentSectionElement.scrollIntoView({block: "center"});
            }

        });

        this.handleActionMoveElementDown = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-move-down');
        this.handleActionMoveElementDown.addEventListener('click', () => {

            console.log('move down');

            if (this.currentSectionElement.nextElementSibling) {
                this.currentSectionElement.parentNode.insertBefore(this.currentSectionElement.nextElementSibling, this.currentSectionElement);

                this.currentSectionElement.scrollIntoView({block: "center"});
            }

        });

        this.handleActionMoveElementDuplicate = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-duplicate');
        this.handleActionMoveElementFavorite = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-favorite');

        this.handleActionRemove = this.iframeManager.document.getElementById('js-live-edit-section-handle-action-remove');
        this.handleActionRemove.addEventListener('click', () => {

            console.log('remove');
            this.currentSectionElement.remove();

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

                app.currentSectionElement = getElementParentSectionElement;

                if (!getElementParentSectionElement.previousElementSibling) {
                    app.handleActionMoveElementUp.setAttribute('disabled', 'disabled');
                } else {
                    app.handleActionMoveElementUp.removeAttribute('disabled');
                }

                if (!getElementParentSectionElement.nextElementSibling) {
                    app.handleActionMoveElementDown.setAttribute('disabled', 'disabled');
                } else {
                    app.handleActionMoveElementDown.removeAttribute('disabled');
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
