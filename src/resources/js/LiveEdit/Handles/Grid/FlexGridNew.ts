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

            this.flexGridElement.style.gridRowStart = 1;
            this.flexGridElement.style.gridRowEnd = 1;
            this.flexGridElement.style.gridColumnStart = 1;
            this.flexGridElement.style.gridColumnEnd = 1;

        });

    }



}
