import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

export class FlexGridMover extends ElementHandle {

    public element;

    public resizeMove;
    public resizeMoveNow = false;

    public currentFlexGrid = null;

    public pos1 = 0;
    public pos2 = 0;
    public pos3 = 0;
    public pos4 = 0;

    constructor(public liveEdit) {

        super(liveEdit);

        let instance = this;

        this.iframeManager.document.addEventListener('mousedown', (mouseDown) => {
            console.log('mousedown');

            mouseDown.preventDefault();
            mouseDown.stopPropagation();

            let clickedElement = instance.liveEdit.clickedElement;

            console.log(clickedElement);

            this.currentFlexGrid = elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid');
            if (!this.currentFlexGrid) {
                return false;
            }

            let flexGridElement = elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid-element');
            if (!flexGridElement) {
                return;
            }

            instance.resizeMoveNow = true;
            instance.initDrag(mouseDown);
        })

    }

    public calculateHandlePosition() {

        let app = this;
        let clickedElement = app.liveEdit.clickedElement;

        this.currentFlexGrid = elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid');
        if (!this.currentFlexGrid) {
            return false;
        }

        let flexGridElement = elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid-element');
        if (!flexGridElement) {
            return;
        }

        // if (!clickedElement.classList.contain('webesembly-grid')) {
        //     clickedElement.classList.add('webesembly-grid');
        // }

        // app.element.style.width = (flexGridElement.offsetWidth + 60) + 'px';
        // app.element.style.height = (flexGridElement.offsetHeight + 60) + 'px';
        //
        // let mouseOverElementBounding = flexGridElement.getBoundingClientRect();
        // app.element.style.top = (mouseOverElementBounding.top + (app.iframeManager.window.scrollY - 30)) + 'px';
        // app.element.style.left = (mouseOverElementBounding.left + (app.iframeManager.window.scrollX - 30)) + 'px';
        //
        // app.element.style.display = 'block';
    }

    public createElementHandle() {

        const createElementHandle = this.iframeManager.document.createElement("div");

        createElementHandle.id = 'js-webesembly-element-handle-flex-grid-resizer';
        createElementHandle.innerHTML = '' +
            '' +
            '<button id="js-webesembly-element-handle-flex-grid-resizer-move" type="button"> move </button>' +
            '' +
            '';
        this.iframeManager.body.appendChild(createElementHandle);

        this.element = this.iframeManager.document.getElementById('js-webesembly-element-handle-flex-grid-resizer');
        //this.resizeMove = this.iframeManager.document.getElementById('js-webesembly-element-handle-flex-grid-resizer-move');


        // grid-row-start
        // grid-row-end
        // grid-column-start
        // grid-column-end

        let instance = this;
        // this.resizeMove.addEventListener('click', (clickEvent) => {
        //     clickEvent.preventDefault();
        //     clickEvent.stopPropagation();
        // });

        // this.resizeMove.addEventListener('mousedown', (clickEvent) => {
        //
        //     clickEvent.preventDefault();
        //     clickEvent.stopPropagation();
        //     if (!this.liveEdit.clickedElement) {
        //         return false;
        //     }
        //
        //     instance.resizeMoveNow = true;
        //     instance.initDrag(clickEvent);
        // });

    }

    public offsetTop = 0;
    public offsetLeft = 0;

    initDrag = (e) => {

        let clickedElement = this.liveEdit.clickedElement;
        let flexGridElement = elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid-element');
        if (!flexGridElement) {
            return;
        }

        this.offsetTop = flexGridElement.offsetTop;
        this.offsetLeft = flexGridElement.offsetLeft;

        this.iframeManager.document.addEventListener('mousemove', this.doDrag, false);
        this.iframeManager.document.addEventListener('mouseup', this.stopDrag, false);

        console.log('initDrag');

        this.appendBackgroundGridDisplay();

        // let gridRow = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-row');
        // for (let i = 0; i < gridRow.length; i++) {
        //     gridRow[i].style['opacity'] = 1;
        // }
        // let gridColumn = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-column');
        // for (let i = 0; i < gridColumn.length; i++) {
        //     gridColumn[i].style['opacity'] = 1;
        // }
    }

    doDrag = (e) => {

       let instance = this;

        let clickedElement = this.liveEdit.clickedElement;
        let flexGridElement = elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid-element');
        if (!flexGridElement) {
            return;
        }

       console.log('doDrag');

        if (instance.resizeMoveNow) {

            //let boundingClientRectMove = this.resizeMove.getBoundingClientRect();

            let currentFlexGridBounding = this.currentFlexGrid.getBoundingClientRect();
            let mouseInGridY = e.clientY - currentFlexGridBounding.top;
            let mouseInGridX = e.clientX - currentFlexGridBounding.left;

            // flexGridElement.style.position = "relative";
            // flexGridElement.style.top = (mouseInGridY - this.offsetTop) + "px";
            // flexGridElement.style.left = (mouseInGridX - this.offsetLeft) + "px";


            console.log("Left? : " + mouseInGridX + " ; Top? : " + mouseInGridY + ".");
            console.log(this.currentFlexGrid);

            // let diffBetweenMoveY = Math.abs((boundingClientRectMove.y - e.clientY) / e.clientY * 100);
            // if (diffBetweenMoveY > 5) {
            //     console.log('diffBetweenMove' + diffBetweenMoveY);
            //     if (boundingClientRectMove.y > e.clientY) {
            //         console.log('move top' + boundingClientRectMove.y);
            //         // flexGridElement.style['grid-row-start'] = (parseInt(flexGridElement.style['grid-row-start']) - 1);
            //         // flexGridElement.style['grid-row-end'] = (parseInt(flexGridElement.style['grid-row-end']) - 1);
            //     } else {
            //         console.log('move down' + boundingClientRectMove.y);
            //
            //         // flexGridElement.style['grid-row-start'] = (parseInt(flexGridElement.style['grid-row-start']) + 1);
            //         // flexGridElement.style['grid-row-end'] = (parseInt(flexGridElement.style['grid-row-end']) + 1);
            //     }
            // }
            //
            // let diffBetweenMoveX = Math.abs((boundingClientRectMove.x - e.clientX) / e.clientX * 100);
            // if (diffBetweenMoveX > 5) {
            //     console.log('diffBetweenMove' + diffBetweenMoveX);
            //     if (boundingClientRectMove.x > e.clientX) {
            //         console.log('move top' + boundingClientRectMove.x);
            //         // flexGridElement.style['grid-column-start'] = (parseInt(flexGridElement.style['grid-column-start']) - 1);
            //         // flexGridElement.style['grid-column-end'] = (parseInt(flexGridElement.style['grid-column-end']) - 1);
            //     } else {
            //         console.log('move down' + boundingClientRectMove.x);
            //         // flexGridElement.style['grid-column-start'] = (parseInt(flexGridElement.style['grid-column-start']) + 1);
            //         // flexGridElement.style['grid-column-end'] = (parseInt(flexGridElement.style['grid-column-end']) + 1);
            //     }
            // }
            //
            // console.log('resizeMoveNow');


           // instance.calculateHandlePosition();

            if (instance.liveEdit.clickedElement) {
                this.liveEdit.handles.clickedElementHandle.calculateHandlePosition();
            }

            if (this.liveEdit.clickedModule) {
                this.liveEdit.handles.clickedModuleHandle.calculateHandlePosition();
            }

            console.log(this.liveEdit.handles.clickedModuleHandle);
        }

       console.log('doDrag');
    }

    stopDrag = (e) => {

        this.iframeManager.document.removeEventListener('mousemove', this.doDrag, false);
        this.iframeManager.document.removeEventListener('mouseup', this.stopDrag, false);

        console.log('stopDrag');

        let clickedElement = this.liveEdit.clickedElement;
        let flexGridElement = elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid-element');
        if (!flexGridElement) {
            return;
        }
        this.offsetTop = flexGridElement.offsetTop;
        this.offsetLeft = flexGridElement.offsetLeft;

        let gridRow = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-row');
        // for (let i = 0; i < gridRow.length; i++) {
        //     gridRow[i].style['opacity'] = 0;
        // }
        while(gridRow.length > 0){
            gridRow[0].parentNode.removeChild(gridRow[0]);
        }

        let gridColumn = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-column');
        // for (let i = 0; i < gridColumn.length; i++) {
        //     gridColumn[i].style['opacity'] = 0;
        // }
        while(gridColumn.length > 0){
            gridColumn[0].parentNode.removeChild(gridColumn[0]);
        }

    }


    public appendBackgroundGridDisplay(gridRows = 12, gridColumns = 26)
    {
        let currentGrid = elementHasParentsWithAttribute(this.liveEdit.clickedElement, 'webesembly:flex-grid');
        if (currentGrid) {

            // Add grid columns display
            for (let gridColumnI = 1; gridColumnI < gridColumns + 1; gridColumnI++) {
                let gridColumn = document.createElement("div");
                gridColumn.setAttribute('style', 'grid-area: 1 / ' + gridColumnI + ' / -1 / ' + gridColumnI);
                gridColumn.classList.add('js-webesembly-grid-column');
                //gridColumn.innerHTML = 'x' + gridColumnI;

                currentGrid.append(gridColumn);
            }

            // Add grid rows display
            for (let gridRowI = 1; gridRowI < gridRows + 1; gridRowI++) {
                let gridRow = document.createElement("div");
                gridRow.setAttribute('style', 'grid-area: ' + gridRowI + ' / 1 / ' + gridRowI + '/ -1');
                gridRow.classList.add('js-webesembly-grid-row');
                //gridRow.innerHTML = 'y' + gridRowI;

                currentGrid.append(gridRow);
            }

        }
    }

}
