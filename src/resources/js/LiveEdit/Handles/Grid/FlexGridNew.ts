import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

export class FlexGridNew extends ElementHandle {

    public currentFlexGrid = null;
    public flexGridElement = null;

    public draggingElement = null;

    constructor(public liveEdit) {

        super(liveEdit);

        let instance = this;

        console.log("FlexGridNew constructor");

        this.iframeManager.document.addEventListener('mousedown', (mouseDown) => {

            console.log('mousedown');

            let mouseOverElement = instance.liveEdit.mouseOverElement;
            console.log(mouseOverElement);
            this.currentFlexGrid = elementHasParentsWithAttribute(mouseOverElement, 'webesembly:flex-grid');
            if (!this.currentFlexGrid) {
                return false;
            }
            this.flexGridElement = elementHasParentsWithAttribute(mouseOverElement, 'webesembly:flex-grid-element');
            if (!this.flexGridElement) {
                return;
            }

            console.log('flexGridElement');
            console.log(this.flexGridElement);


            this.draggingElement = this.flexGridElement;


            instance.initDrag(mouseDown);

        });

    }

    initDrag = (e) => {

        console.log('initDrag');

        this.iframeManager.document.addEventListener('mousemove', this.doDrag, false);
        this.iframeManager.document.addEventListener('mouseup', this.stopDrag, false);

    }

    doDrag = (e) => {
        console.log('doDrag');
    }

    stopDrag = (e) => {
        console.log('stopDrag');

        this.iframeManager.document.removeEventListener('mousemove', this.doDrag, false);
        this.iframeManager.document.removeEventListener('mouseup', this.stopDrag, false);

    }

}
