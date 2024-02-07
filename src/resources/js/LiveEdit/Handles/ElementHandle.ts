import {allowedEditElementsList, elementHasParentsWithId, elementHasParentsWithAttribute} from "../helpers";

export class ElementHandle {

    public iframeManager;

    public constructor(public liveEdit) {
        this.iframeManager = liveEdit.iframeManager;
    }

    public canIEditThisElement(element)
    {
        const allowedElementsList = allowedEditElementsList();
        if (!allowedElementsList.includes(element.tagName)) {
            return false;
        }

        // if (!elementHasParentsWithAttribute(element, 'webesembly:editable')) {
        //     return false;
        // }
        //
        // if (elementHasParentsWithAttribute(element, 'webesembly:module')) {
        //     return false;
        // }
        //
        // if (element.hasAttribute('webesembly:module')) {
        //     return false;
        // }

        if (elementHasParentsWithId(element, 'js-webesembly-element-handle')) {
            return false;
        }

        if (elementHasParentsWithId(element, 'js-webesembly-element-handle-active')) {
            return false;
        }

        return true;
    }

}
