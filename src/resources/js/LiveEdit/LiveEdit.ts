import {elementHasParentsWithId, getElementFriendlyName} from "./helpers";
import {IframeManager} from "./IframeManager";

import {MouseOverHeaderHandle} from "./Handles/Header/MouseOverHeaderHandle";
import {MouseOverFooterHandle} from "./Handles/Footer/MouseOverFooterHandle";
import {MouseOverSectionHandle} from "./Handles/Sections/MouseOverSectionHandle";

import {ClickedElementHandle} from "./Handles/Elements/ClickedElementHandle";
import {MouseOverElementHandle} from "./Handles/Elements/MouseOverElementHandle";
import {FlexGridResizer} from "./Handles/Grid/FlexGridResizer";

import {MouseOverModuleHandle} from "./Handles/Modules/MouseOverModuleHandle";
import {ClickedModuleHandle} from "./Handles/Modules/ClickedModuleHandle";
import axios from "axios";

export class LiveEdit {

    public iframeManager;

    public clickedElement;
    public clickedModule;

    public mouseOverElement;
    public mouseOverModule;
    public draggedElement;

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

            app.handles.clickedModuleHandle = new ClickedModuleHandle(app);
            app.handles.mouseOverModuleHandle = new MouseOverModuleHandle(app);

            app.iframeManager.body.addEventListener("keyup", (event) => {
                app.handles.clickedElementHandle.calculateHandlePosition();
            });

           app.appendStyles();
          // app.findDuplicableElements();

       });

        document.addEventListener("JsLiveEdit::RequestToSavePage", (event) => {

            let sections = {};

            let getElementSections = app.iframeManager.body.querySelectorAll('.webesembly-section');
            for (let i = 0; i < getElementSections.length; i++) {
                let sectionElement = getElementSections[i];

                let sectionObject = {
                    gridSettings: {
                        gridGap: '12',
                        gridTemplateColumns: '20',
                        gridTemplateRows: '20',
                    },
                    backgroundSettings: {
                        image: '',
                    },
                    content: []
                };

                let sectionId = sectionElement.classList.item(1).replace('webesembly-section-', '');

                let sectionComputedStyle = getComputedStyle(sectionElement);
                sectionObject.backgroundSettings.image = sectionComputedStyle.backgroundImage;

                let sectionFlexGridComputedStyle = getComputedStyle(sectionElement.querySelector('.webesembly-flex-grid'));
                let sectionGridTemplateColumns = '20';
                let sectionGridTemplateRows = '20';
                let sectionGridGap = '12';

                if (sectionFlexGridComputedStyle.gridTemplate) {
                    let parseSectionGridTemplate = sectionFlexGridComputedStyle.gridTemplate;
                    let parseSectionGridTemplateColumns = parseSectionGridTemplate.split('/')[0].trim();
                    let parseSectionGridTemplateRows = parseSectionGridTemplate.split('/')[1].trim();
                    sectionGridTemplateColumns = parseSectionGridTemplateColumns.replace('repeat(', '').replace(')', '').split(',')[0].trim();
                    sectionGridTemplateRows = parseSectionGridTemplateRows.replace('repeat(', '').replace(')', '').split(',')[0].trim();
                }

                if (sectionFlexGridComputedStyle.gridGap) {
                    sectionGridGap = sectionFlexGridComputedStyle.gridGap;
                }

                sectionObject.gridSettings.gridGap = sectionGridGap;

                sectionElement.querySelectorAll('.webesembly-flex-grid-block').forEach(flexGridBlock => {
                    let webesebmlyEditable = flexGridBlock.querySelector('.webesembly-editable');
                    console.log(webesebmlyEditable);

                    if (webesebmlyEditable) {
                        let flexGridBlockId = flexGridBlock.classList.item(1).replace('webesembly-flex-grid-block-', '');
                        let computedStyle = getComputedStyle(flexGridBlock);
                        let flexGridBlockObject = {
                            'id': flexGridBlockId,
                            'value': webesebmlyEditable.innerHTML,
                            'gridArea': computedStyle.gridArea,
                        };
                        sectionObject.content.push(flexGridBlockObject);
                    }
                });
                sections[sectionId] = sectionObject;
            }

            console.log(sections);
            return;
            axios.post('/webesembly/save-page', {
                'name': 'Home',
                'sections': sections,
            }).then(() => {
                this.successMessageModal('Промените са запазени!');
            }).catch(error => {
                this.errorMessageModal('Възникна грешка при запазването на промените!');
            });

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
