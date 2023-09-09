import {elementHasParentsWithId, getElementFriendlyName} from "./helpers";
import {IframeManager} from "./IframeManager";

import {MouseOverHeaderHandle} from "./Handles/Header/MouseOverHeaderHandle";
import {MouseOverFooterHandle} from "./Handles/Footer/MouseOverFooterHandle";
import {MouseOverSectionHandle} from "./Handles/Sections/MouseOverSectionHandle";

import {ClickedElementHandle} from "./Handles/Elements/ClickedElementHandle";
import {MouseOverElementHandle} from "./Handles/Elements/MouseOverElementHandle";
import {FlexGridResizer} from "./Handles/Grid/FlexGridResizer";
import {FlexGridMover} from "./Handles/Grid/FlexGridMover";

import {MouseOverModuleHandle} from "./Handles/Modules/MouseOverModuleHandle";
import {ClickedModuleHandle} from "./Handles/Modules/ClickedModuleHandle";
import axios from "axios";

export class LiveEdit {

    public iframeManager;

    public clickedElement;
    public clickedModule;

    public mouseOverElement;
    public mouseOverModule;

    public handles = {
        mouseOverHeaderHandle: {},
        mouseOverFooterHandle: {},
        mouseOverSectionHandle: {},
        clickedElementHandle: {
            calculateHandlePosition: function() {}
        },
        clickedModuleHandle: {},
        mouseOverElementHandle: {},
        mouseOverModuleHandle: {},
        flexGridResizerHandle: {},
        flexGridMoverHandle: {},
    };

    public duplicableElements = [];

    public constructor(public iframeId: string) {}

    public fire() {

       const app = this;

        app.iframeManager = new IframeManager(this.iframeId);
        app.iframeManager.onLoad(function() {

           app.handles.mouseOverHeaderHandle = new MouseOverHeaderHandle(app);
           app.handles.mouseOverFooterHandle = new MouseOverFooterHandle(app);

           app.handles.mouseOverSectionHandle = new MouseOverSectionHandle(app);

           app.handles.clickedElementHandle = new ClickedElementHandle(app);
           app.handles.mouseOverElementHandle = new MouseOverElementHandle(app);

           app.handles.flexGridResizerHandle = new FlexGridResizer(app);
         //  app.handles.flexGridMoverHandle = new FlexGridMover(app);

            app.handles.clickedModuleHandle = new ClickedModuleHandle(app);
            app.handles.mouseOverModuleHandle = new MouseOverModuleHandle(app);

            app.iframeManager.body.addEventListener("keyup", (event) => {
                app.handles.clickedElementHandle.calculateHandlePosition();
            });

           app.appendStyles();
          // app.findDuplicableElements();

       });

        document.addEventListener("JsLiveEdit::RequestToSavePage", (event) => {

            let findPageElements = app.iframeManager.body.querySelectorAll('[webesembly\\:page]');
            for (let i = 0; i < findPageElements.length; i++) {
                let savePageElement = findPageElements[i];
                let saveSections = [];

                let currentPageDomCloned  = document.createElement('div');
                currentPageDomCloned.innerHTML = savePageElement.innerHTML;

                let findSections = currentPageDomCloned.querySelectorAll('[webesembly\\:section]');
                for (let j = 0; j < findSections.length; j++) {


                   // console.log(findSections);
                    saveSections.push({
                        'name':findSections[j].getAttribute('webesembly:section'),
                        'attributes':findSections[j].attributes,
                        'pageName:':savePageElement.getAttribute('webesembly:page'),
                        'html':findSections[j].innerHTML,
                    });
                    findSections[j].innerHTML = '';
                }

                axios.post('/webesembly/save-page', {
                    'name':savePageElement.getAttribute('webesembly:page'),
                    'html':currentPageDomCloned.innerHTML,
                    'sections': saveSections
                }).then(() => {
                    this.successMessageModal('Промените са запазени!');
                }).catch(error => {
                    this.errorMessageModal('Възникна грешка при запазването на промените!');
                });
            }

        });

        document.addEventListener("JsLiveEdit::RequestToResetPage", (event) => {

            let findPageElements = app.iframeManager.body.querySelectorAll('[webesembly\\:page]');
            for (let i = 0; i < findPageElements.length; i++) {
                let savePageElement = findPageElements[i];

                axios.post('/webesembly/reset-page', {
                    'name':savePageElement.getAttribute('webesembly:page'),
                }).then((result) => {

                    this.successMessageModal('Страницата е върната в първоначалното си състояние!');
                    window.location.reload();
                }).catch(error => {
                    this.errorMessageModal('Възникна грешка при връщането на страницата в първоначалното си състояние!');
                });
            }

        });

    }
    public errorMessageModal(message) {
        let liveEditEvent = new CustomEvent('JsLiveEdit::MessageModal', {
            detail: {
                title: message,
                description: false,
            }
        });
        document.dispatchEvent(liveEditEvent);
    }

    public successMessageModal(message) {
        let liveEditEvent = new CustomEvent('JsLiveEdit::MessageModal', {
            detail: {
                title: message,
                description: false,
            }
        });
        document.dispatchEvent(liveEditEvent);
    }

    private appendStyles()
    {
        var head = this.iframeManager.document.getElementsByTagName('head')[0];

        var link = this.iframeManager.document.createElement('link');
        link.id = 'js-tailwind-editor-iframe-styles';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = '/webesembly-editor/webesembly-iframe.css';
        link.media = 'all';
        head.appendChild(link);
    }
}
