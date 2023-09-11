import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithClass,
    elementHasParentsWithAttribute
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";
import EditorJS from "@editorjs/editorjs";
import Header from '@editorjs/header';
import List from '@editorjs/list';

export class ClickedElementHandle extends ElementHandle {

    public name;
    public element;
    public settings;


    constructor(public liveEdit) {

        super(liveEdit);

        var toolbarQuill = this.iframeManager.document.createElement('div');
        toolbarQuill.id = 'js-quill-toolbar';
        toolbarQuill.innerHTML = `

          <!-- Add font size dropdown -->
  <select class="ql-size">
    <option value="small"></option>
    <!-- Note a missing, thus falsy value, is used to reset to default -->
    <option selected></option>
    <option value="large"></option>
    <option value="huge"></option>
  </select>
  <!-- Add a bold button -->
  <button class="ql-bold"></button>
  <!-- Add subscript and superscript buttons -->
  <button class="ql-script" value="sub"></button>
  <button class="ql-script" value="super"></button>

        `;
        this.iframeManager.document.getElementsByTagName('body')[0].appendChild(toolbarQuill);


        var head = this.iframeManager.document.getElementsByTagName('head')[0];

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
                    toolbar: {
                        container: '#js-quill-toolbar',
                     }
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
        createElementHandle.id = 'js-webesembly-element-handle-active';
        //<div id="js-webesembly-element-handle-active-name">Image</div>
        createElementHandle.innerHTML = '' +
            '<div id="js-webesembly-element-handle-active-settings">' +
            '<button type="button">Settings</button>' +
            '</div>';

        this.iframeManager.body.appendChild(createElementHandle);

        this.element = this.iframeManager.document.getElementById('js-webesembly-element-handle-active');
        this.name = this.iframeManager.document.getElementById('js-webesembly-element-handle-active-name');
        this.settings = this.iframeManager.document.getElementById('js-webesembly-element-handle-active-settings');
    }

    public enableSettingsDelete()
    {
        let app = this;
        let createDeleteElementHandle = this.iframeManager.document.createElement('button');
        createDeleteElementHandle.innerText = 'Delete';
        createDeleteElementHandle.addEventListener('click', function (e) {
            e.preventDefault();
            app.liveEdit.clickedElement.remove();
        });

        this.settings.append(createDeleteElementHandle);
    }

    public enableSettingsDuplicate()
    {
        let app = this;
        let createCloneElementHandle = this.iframeManager.document.createElement('button');
        createCloneElementHandle.innerText = 'Clone';
        createCloneElementHandle.addEventListener('click', function (e) {
            e.preventDefault();
            app.liveEdit.clickedElement.outerHTML += app.liveEdit.clickedElement.outerHTML;

            // find new duplicable elements
            app.liveEdit.findDuplicableElements();
        });

        this.settings.append(createCloneElementHandle);
    }

    public resetSettings()
    {
        this.settings.innerHTML = '';
    }

    public addListener() {

        const app = this;
        app.iframeManager.document.addEventListener('click', e => {

            app.element.style.display = 'none';
            app.resetSettings();

            let clickedElement = app.iframeManager.document.elementFromPoint(e.clientX, e.clientY);
            if (clickedElement) {

                // console.log(clickedElement);
                //
                // let removeQlToolbar = true;
                // let checkIsQlToolbar = elementHasParentsWithClass(clickedElement, 'ql-toolbar ql-snow');
                // if (checkIsQlToolbar) {
                //     removeQlToolbar = false;
                // }
                //
                // if (removeQlToolbar) { 
                //     let qlToolbars = app.iframeManager.document.querySelectorAll('.ql-toolbar');
                //     for (var i = 0; i < qlToolbars.length; i++) {
                //         qlToolbars[i].style.display = 'none';
                //     }
                // }

                if (!this.canIEditThisElement(clickedElement)) {
                    this.liveEdit.clickedElement = null;
                    return;
                }

                let getElementParentSectionElement = elementHasParentsWithAttribute(clickedElement, 'webesembly:section');
                if (!getElementParentSectionElement) {
                    return;
                }

                if (clickedElement.hasAttribute('webesembly:flex-grid')) {
                    return;
                }

                // Remove old content editable elements
                let editableElementsInPage = app.iframeManager.body.getElementsByTagName('*');
                for (var j = 0; j < editableElementsInPage.length; j++) {
                    if (editableElementsInPage[j].hasAttribute('contenteditable')) {
                        editableElementsInPage[j].removeAttribute('contenteditable');
                    }
                }

               // this.enableSettingsDelete();

                this.liveEdit.clickedElement = clickedElement;
                this.liveEdit.handles.mouseOverElementHandle.hide();

                let canIDuplicateElement = false;
                this.liveEdit.duplicableElements.forEach(function (item) {
                   if (item == clickedElement) {
                       canIDuplicateElement = true;
                   }
                });

                if (canIDuplicateElement) {
                    this.enableSettingsDuplicate();
                }

                let liveEditEvent = new CustomEvent('JsLiveEdit::ElementChange', {
                    detail: {
                        element: clickedElement,
                        elementType: clickedElement.tagName,
                        classList: clickedElement.classList,
                    }
                })
                document.dispatchEvent(liveEditEvent);

                let flexGridElementContent = elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid-element-content');

                console.log(clickedElement);

                // let flexGridElementContent = elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid-element-content');
                //
                // console.log(flexGridElementContent);
                //
                // if (flexGridElementContent) {
                //
                //     // const editor = new EditorJS({
                //     //     holder: mainEditableElement,
                //     //     // tools: {
                //     //     //     header: {
                //     //     //         class: Header,
                //     //     //         inlineToolbar: ['link']
                //     //     //     },
                //     //     //     list: {
                //     //     //         class: List,
                //     //     //         inlineToolbar: true
                //     //     //     }
                //     //     // },
                //     // });
                //
                //      // mainEditableElement.setAttribute('contenteditable', 'true');
                //     flexGridElementContent.querySelector('.ql-toolbar').style.display = 'block';
                // }

                //flexGridElementContent.classList.add('js-webesembly-element');

                app.element.style.width = (flexGridElementContent.offsetWidth + 10) + 'px';
                app.element.style.height = (flexGridElementContent.offsetHeight + 10) + 'px';

                let mouseOverElementBounding = flexGridElementContent.getBoundingClientRect();
                app.element.style.top = (mouseOverElementBounding.top + (app.iframeManager.window.scrollY - 5)) + 'px';
                app.element.style.left = (mouseOverElementBounding.left + (app.iframeManager.window.scrollX - 5)) + 'px';

                if (app.name) {
                    app.name.innerText = getElementFriendlyName(clickedElement.tagName);
                }

                app.element.style.display = 'block';

            }
        }, {passive: true});
    }

    public calculateHandlePosition() {
        let app = this;
        let clickedElement = app.liveEdit.clickedElement;

        if (app.element && clickedElement) {

            app.element.style.width = (clickedElement.offsetWidth + 20) + 'px';
            app.element.style.height = (clickedElement.offsetHeight + 20) + 'px';

            let mouseOverElementBounding = clickedElement.getBoundingClientRect();
            app.element.style.top = (mouseOverElementBounding.top + (app.iframeManager.window.scrollY - 10)) + 'px';
            app.element.style.left = (mouseOverElementBounding.left + (app.iframeManager.window.scrollX - 10)) + 'px';

        }
    }

}
