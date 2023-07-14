import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

export class ClickedModuleHandle extends ElementHandle {

    public handleNameElement;
    public handleMainElement;
    public handleSettingsWrapperElement;

    constructor(public liveEdit) {

        super(liveEdit);

        this.createElementHandle();
        this.addListener();
    }

    public createElementHandle() {

        const createElementHandleSettings = this.iframeManager.document.createElement("div");
        createElementHandleSettings.id = 'js-live-edit-module-handle-active-settings';
        createElementHandleSettings.innerHTML = '' +
            '<div id="js-live-edit-module-handle-active-name">Module Name</div>' +
            '<div><button>Settings</button></div>';
        createElementHandleSettings.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        const createElementHandle = this.iframeManager.document.createElement("div");
        createElementHandle.id = 'js-live-edit-module-handle-active';
        createElementHandle.append(createElementHandleSettings);

        this.iframeManager.body.appendChild(createElementHandle);

        this.handleMainElement = this.iframeManager.document.getElementById('js-live-edit-module-handle-active');
        this.handleSettingsWrapperElement = this.iframeManager.document.getElementById('js-live-edit-module-handle-active-settings');
        this.handleNameElement = this.iframeManager.document.getElementById('js-live-edit-module-handle-active-name');
    }

    public enableSettingsName(name = '')
    {
        let app = this;

        let createTitleElementContainerHandle = this.iframeManager.document.createElement('div');
        createTitleElementContainerHandle.innerHTML = name;
        createTitleElementContainerHandle.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        this.handleSettingsWrapperElement.append(createTitleElementContainerHandle);
    }

    public enableSettingsButton()
    {
        let app = this;
        let createDeleteElementHandle = this.iframeManager.document.createElement('button');
        createDeleteElementHandle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="translate(24 0) scale(-1 1)"><g><circle cx="12" cy="12" r="2" /><path d="m5.399 5.88l.25-.434a.5.5 0 0 0-.617.093l.367.34ZM3.4 9.344l-.478-.148a.5.5 0 0 0 .228.58l.25-.432Zm-.002 5.311l-.25-.433a.5.5 0 0 0-.228.581l.478-.148Zm2 3.464l-.367.34a.5.5 0 0 0 .617.093l-.25-.433Zm4.6 2.655h-.5a.5.5 0 0 0 .39.488l.11-.488Zm4.001.002l.111.488a.5.5 0 0 0 .389-.488H14ZM18.6 18.12l-.25.433a.5.5 0 0 0 .617-.093l-.367-.34Zm1.998-3.466l.478.148a.5.5 0 0 0-.228-.58l-.25.432Zm.002-5.311l.25.433a.5.5 0 0 0 .228-.581l-.478.148Zm-2-3.465l.367-.34a.5.5 0 0 0-.617-.093l.25.433ZM14 3.225h.5a.5.5 0 0 0-.389-.487L14 3.225Zm-4-.002l-.111-.488a.5.5 0 0 0-.39.488h.5Zm4 1.849h-.5h.5Zm5 8.66l-.25.433l.25-.433Zm-2 3.464l-.25.433l.25-.433ZM5 13.732l.25.433l-.25-.433Zm2-6.928l-.25.433l.25-.433ZM3.878 9.492a8.49 8.49 0 0 1 1.887-3.273l-.733-.68a9.49 9.49 0 0 0-2.11 3.658l.956.295Zm.76 6.758a8.527 8.527 0 0 1-.761-1.742l-.956.296a9.54 9.54 0 0 0 .852 1.946l.866-.5Zm1.128 1.53a8.53 8.53 0 0 1-1.127-1.53l-.866.5a9.528 9.528 0 0 0 1.259 1.71l.734-.68Zm8.123 2.51a8.49 8.49 0 0 1-3.778-.002l-.222.974a9.491 9.491 0 0 0 4.222.003l-.222-.975Zm6.233-5.782a8.49 8.49 0 0 1-1.887 3.273l.733.68a9.491 9.491 0 0 0 2.11-3.658l-.956-.295Zm-.76-6.758c.324.563.577 1.147.762 1.742l.955-.296a9.529 9.529 0 0 0-.852-1.946l-.866.5Zm-1.128-1.53a8.48 8.48 0 0 1 1.127 1.53l.866-.5a9.524 9.524 0 0 0-1.259-1.71l-.734.68Zm-8.123-2.51a8.49 8.49 0 0 1 3.778.002l.222-.974a9.49 9.49 0 0 0-4.222-.003l.222.975Zm.389 1.362v-1.85h-1v1.85h1ZM7.25 6.37l-1.601-.925l-.5.866l1.6.925l.5-.866Zm-2.5 6.928l-1.601.924l.5.866l1.6-.924l-.5-.866Zm.5-3.464l-1.6-.923l-.5.866l1.6.923l.5-.866Zm5.25 10.94v-1.847h-1v1.847h1Zm-3.75-4.012l-1.601.924l.5.866l1.6-.924l-.5-.866Zm12.101.925l-1.601-.925l-.5.866l1.601.925l.5-.866Zm-4.351 3.09v-1.85h-1v1.85h1ZM20.351 8.91l-1.601.924l.5.866l1.601-.924l-.5-.866Zm.498 5.311L19.25 13.3l-.5.866l1.6.923l.5-.866ZM14.5 5.072V3.225h-1v1.847h1Zm3.851.374l-1.601.925l.5.866l1.601-.925l-.5-.866ZM13.5 5.072c0 1.924 2.083 3.127 3.75 2.165l-.5-.866a1.5 1.5 0 0 1-2.25-1.3h-1Zm5.25 4.763c-1.667.962-1.667 3.368 0 4.33l.5-.866a1.5 1.5 0 0 1 0-2.598l-.5-.866Zm-1.5 6.928c-1.667-.962-3.75.24-3.75 2.165h1a1.5 1.5 0 0 1 2.25-1.299l.5-.866Zm-6.75 2.165c0-1.924-2.083-3.127-3.75-2.165l.5.866a1.5 1.5 0 0 1 2.25 1.3h1Zm-5.25-4.763c1.667-.962 1.667-3.368 0-4.33l-.5.866c1 .577 1 2.02 0 2.598l.5.866ZM9.5 5.072A1.5 1.5 0 0 1 7.25 6.37l-.5.866c1.667.962 3.75-.24 3.75-2.165h-1Z"/></g></g></svg>';
        createDeleteElementHandle.addEventListener('click', function (e) {
            e.stopPropagation();
            alert('Delete module');
        });

        let createDeleteElementContainerHandle = this.iframeManager.document.createElement('div');
        createDeleteElementContainerHandle.append(createDeleteElementHandle);

        this.handleSettingsWrapperElement.append(createDeleteElementContainerHandle);
    }

    public resetSettings()
    {
        this.handleSettingsWrapperElement.innerHTML = '';
    }

    public addListener() {

        const app = this;
        app.iframeManager.document.addEventListener('click', e => {

            app.handleMainElement.style.display = 'none';
            app.resetSettings();

            let clickedElement = app.iframeManager.document.elementFromPoint(e.clientX, e.clientY);
            if (clickedElement) {

                let getElementParentModuleElement = elementHasParentsWithAttribute(clickedElement, 'webesembly:module');
                if (!getElementParentModuleElement) {
                    this.liveEdit.clickedModule = null;
                    return;
                }

                this.liveEdit.clickedModule = getElementParentModuleElement;
                this.liveEdit.handles.mouseOverModuleHandle.hide();

                app.handleMainElement.style.width = (getElementParentModuleElement.offsetWidth + 20) + 'px';
                app.handleMainElement.style.height = (getElementParentModuleElement.offsetHeight + 20) + 'px';

                let clickedElementBounding = getElementParentModuleElement.getBoundingClientRect();
                app.handleMainElement.style.top = (clickedElementBounding.top + (app.iframeManager.window.scrollY - 10)) + 'px';
                app.handleMainElement.style.left = (clickedElementBounding.left + (app.iframeManager.window.scrollX - 10)) + 'px';
                app.handleMainElement.style.display = 'block';

                let moduleFriendlyName = getElementParentModuleElement.getAttribute('webesembly:module').toUpperCase();

                this.enableSettingsName(moduleFriendlyName);
                this.enableSettingsButton();

            }
        }, {passive: true});
    }

}
