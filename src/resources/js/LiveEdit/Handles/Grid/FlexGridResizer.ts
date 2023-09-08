import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

export class FlexGridResizer extends ElementHandle {

    constructor(public liveEdit) {
        super(liveEdit);
        console.log("FlexGridResizer constructor");
    }
    

}
