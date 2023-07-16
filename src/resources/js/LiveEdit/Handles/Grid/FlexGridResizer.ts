import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

export class FlexGridResizer extends ElementHandle {

    public element;


    public resizeMove;
    public resizeMoveNow = false;

    public resizeNorth;
    public resizeNorthNow = false;

    public resizeNorthWest;
    public resizeNorthEast;

    public resizeWest;
    public resizeWestNow = false

    public resizeSouth;
    public resizeSouthNow = false;

    public resizeSouthWest;
    public resizeSouthEast;

    public resizeEast;
    public resizeEastNow = false;


    constructor(public liveEdit) {

        super(liveEdit);

        this.createElementHandle();

        let app = this;
        document.addEventListener("JsLiveEdit::ElementChange", (event) => {
            app.calculateHandlePosition();
        });

    }

    public clearHtml(html) {

        let htmlElement = document.createElement('div');
        htmlElement.innerHTML = html;

        let findColumnElements = htmlElement.getElementsByClassName('js-webesembly-grid-column');
        while(findColumnElements.length > 0){
            findColumnElements[0].parentNode.removeChild(findColumnElements[0]);
        }

        let findRowElements = htmlElement.getElementsByClassName('js-webesembly-grid-row');
        while(findRowElements.length > 0){
            findRowElements[0].parentNode.removeChild(findRowElements[0]);
        }

        return htmlElement.innerHTML;
    }

    public calculateHandlePosition() {

        let app = this;
        let clickedElement = app.liveEdit.clickedElement;

        if (!elementHasParentsWithAttribute(clickedElement, 'webesembly:flex-grid')) {
            return false;
        }

        app.element.style.width = (clickedElement.offsetWidth + 60) + 'px';
        app.element.style.height = (clickedElement.offsetHeight + 60) + 'px';

        let mouseOverElementBounding = clickedElement.getBoundingClientRect();
        app.element.style.top = (mouseOverElementBounding.top + (app.iframeManager.window.scrollY - 30)) + 'px';
        app.element.style.left = (mouseOverElementBounding.left + (app.iframeManager.window.scrollX - 30)) + 'px';

        app.element.style.display = 'block';
    }

    public createElementHandle() {

        const createElementHandle = this.iframeManager.document.createElement("div");

        createElementHandle.id = 'js-live-edit-element-handle-flex-grid-resizer';
        createElementHandle.innerHTML = '' +
            '' +
            '<button id="js-live-edit-element-handle-flex-grid-resizer-north" type="button"> north </button>' +
            '<button id="js-live-edit-element-handle-flex-grid-resizer-north-west" type="button"> north-west </button>' +
            '<button id="js-live-edit-element-handle-flex-grid-resizer-north-east" type="button"> north-east </button>' +
            '<button id="js-live-edit-element-handle-flex-grid-resizer-west" type="button"> west </button>' +
            '<button id="js-live-edit-element-handle-flex-grid-resizer-south" type="button"> south </button>' +
            '<button id="js-live-edit-element-handle-flex-grid-resizer-south-west" type="button"> south-west </button>' +
            '<button id="js-live-edit-element-handle-flex-grid-resizer-south-east" type="button"> south-east </button>' +
            '<button id="js-live-edit-element-handle-flex-grid-resizer-east" type="button"> east </button>' +
            '<button id="js-live-edit-element-handle-flex-grid-resizer-move" type="button"> move </button>' +
            '' +
            '';
        this.iframeManager.body.appendChild(createElementHandle);

        this.element = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer');
        this.resizeNorth = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer-north');
        this.resizeNorthWest = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer-north-west');
        this.resizeNorthEast = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer-north-east');
        this.resizeWest = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer-west');
        this.resizeSouth = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer-south');
        this.resizeSouthWest = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer-south-west');
        this.resizeSouthEast = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer-south-east');
        this.resizeEast = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer-east');
        this.resizeMove = this.iframeManager.document.getElementById('js-live-edit-element-handle-flex-grid-resizer-move');


        // grid-row-start
        // grid-row-end
        // grid-column-start
        // grid-column-end

        let instance = this;
        this.resizeMove.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
        });
        this.resizeEast.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
        });
        this.resizeSouth.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
        });
        this.resizeNorth.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
        });
        this.resizeWest.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
        });

        this.resizeMove.addEventListener('mousedown', (clickEvent) => {

            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            if (!this.liveEdit.clickedElement) {
                return false;
            }
            instance.resetAllResizers();
            instance.resizeMoveNow = true;
            instance.initDrag(clickEvent);
        });

        this.resizeEast.addEventListener('mousedown', (clickEvent) => {

            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            if (!this.liveEdit.clickedElement) {
                return false;
            }
            instance.resetAllResizers();
            instance.resizeEastNow = true;
            instance.initDrag(clickEvent);
        });

        this.resizeSouth.addEventListener('mousedown', (clickEvent) => {

            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            if (!this.liveEdit.clickedElement) {
                return false;
            }
            instance.resetAllResizers();
            instance.resizeSouthNow = true;
            instance.initDrag(clickEvent);
        });

        this.resizeNorth.addEventListener('mousedown', (clickEvent) => {

            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            if (!this.liveEdit.clickedElement) {
                return false;
            }
            instance.resetAllResizers();
            instance.resizeNorthNow = true;
            instance.initDrag(clickEvent);
        });

        this.resizeWest.addEventListener('mousedown', (clickEvent) => {

            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            if (!this.liveEdit.clickedElement) {
                return false;
            }
            instance.resetAllResizers();
            instance.resizeWestNow = true;
            instance.initDrag(clickEvent);
        });

    }

    public resetAllResizers() {
        this.resizeNorthNow = false;
        this.resizeWestNow = false;
        this.resizeSouthNow = false;
        this.resizeEastNow = false;
    }

    initDrag = (e) => {
        // startX = e.clientX;
        // startY = e.clientY;
        // startWidth = parseInt(document.defaultView.getComputedStyle(p).width, 10);
        // startHeight = parseInt(document.defaultView.getComputedStyle(p).height, 10);

        this.iframeManager.document.addEventListener('mousemove', this.doDrag, false);
        this.iframeManager.document.addEventListener('mouseup', this.stopDrag, false);

        console.log('initDrag');

        this.appendBackgroundGridDisplay();

        let gridRow = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-row');
        for (let i = 0; i < gridRow.length; i++) {
            gridRow[i].style['opacity'] = 1;
        }
        let gridColumn = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-column');
        for (let i = 0; i < gridColumn.length; i++) {
            gridColumn[i].style['opacity'] = 1;
        }
    }

    doDrag = (e) => {

       let instance = this;

       if (instance.resizeEastNow) {
           let boundingClientRect = this.resizeEast.getBoundingClientRect();
           let diffBetween = Math.abs((boundingClientRect.x - e.clientX) / e.clientX * 100);
           if (diffBetween > 10) {
               if (boundingClientRect.x > e.clientX) {
                   console.log('drag left' + boundingClientRect.x);
                   this.liveEdit.clickedElement.style['grid-column-end'] = (parseInt(this.liveEdit.clickedElement.style['grid-column-end']) - 1);
               } else {
                   console.log('drag right' + boundingClientRect.x);
                   this.liveEdit.clickedElement.style['grid-column-end'] = (parseInt(this.liveEdit.clickedElement.style['grid-column-end']) + 1);
               }
           }
       }

        if (instance.resizeWestNow) {
            let boundingClientRect = this.resizeWest.getBoundingClientRect();
            let diffBetween = Math.abs((boundingClientRect.x - e.clientX) / e.clientX * 100);
            if (diffBetween > 10) {
                if (boundingClientRect.x > e.clientX) {
                    console.log('drag left' + boundingClientRect.x);
                    this.liveEdit.clickedElement.style['grid-column-start'] = (parseInt(this.liveEdit.clickedElement.style['grid-column-start']) - 1);
                } else {
                    console.log('drag right' + boundingClientRect.x);
                    this.liveEdit.clickedElement.style['grid-column-start'] = (parseInt(this.liveEdit.clickedElement.style['grid-column-start']) + 1);
                }
            }
        }

        if (instance.resizeSouthNow) {
            let boundingClientRectSouth = this.resizeSouth.getBoundingClientRect();
            let diffBetweenSouth = Math.abs((boundingClientRectSouth.y - e.clientY) / e.clientY * 100);
            if (diffBetweenSouth > 13) {
                console.log('diffBetweenSouth' + diffBetweenSouth);

                if (boundingClientRectSouth.y > e.clientY) {
                    console.log('drag top' + boundingClientRectSouth.y);
                    let newGridRowEndNegative = (parseInt(this.liveEdit.clickedElement.style['grid-row-end']) - 1);
                    if (newGridRowEndNegative >= 18) {
                        return;
                    }
                    this.liveEdit.clickedElement.style['grid-row-end'] = newGridRowEndNegative;
                } else {
                    console.log('drag bottom' + boundingClientRectSouth.y);
                    let newGridRowEndNegative = (parseInt(this.liveEdit.clickedElement.style['grid-row-end']) + 1);
                    if (newGridRowEndNegative >= 18) {
                        return;
                    }
                    this.liveEdit.clickedElement.style['grid-row-end'] = newGridRowEndNegative;
                }
            }
        }

        if (instance.resizeNorthNow) {
            let boundingClientRectNorth = this.resizeNorth.getBoundingClientRect();
            let diffBetweenNorth = Math.abs((boundingClientRectNorth.y - e.clientY) / e.clientY * 100);
            if (diffBetweenNorth > 23) {
                console.log('diffBetweenNorth' + diffBetweenNorth);

                if (boundingClientRectNorth.y > e.clientY) {
                    console.log('drag top' + boundingClientRectNorth.y);
                    let newGridRowEndNegative = (parseInt(this.liveEdit.clickedElement.style['grid-row-start']) - 1);
                    if (newGridRowEndNegative >= 18) {
                        return;
                    }
                    console.log(newGridRowEndNegative);
                    this.liveEdit.clickedElement.style['grid-row-start'] = newGridRowEndNegative;
                } else {
                    console.log('drag bottom' + boundingClientRectNorth.y);
                    let newGridRowEndNegative = (parseInt(this.liveEdit.clickedElement.style['grid-row-start']) + 1);
                    if (newGridRowEndNegative >= 18) {
                        return;
                    }
                    console.log(newGridRowEndNegative);
                    this.liveEdit.clickedElement.style['grid-row-start'] = newGridRowEndNegative;
                }
            }
        }

        if (instance.resizeMoveNow) {
            let boundingClientRectMove = this.resizeMove.getBoundingClientRect();
            let diffBetweenMoveY = Math.abs((boundingClientRectMove.y - e.clientY) / e.clientY * 100);
            if (diffBetweenMoveY > 23) {
                console.log('diffBetweenMove' + diffBetweenMoveY);
                if (boundingClientRectMove.y > e.clientY) {
                    console.log('move top' + boundingClientRectMove.y);
                    this.liveEdit.clickedElement.style['grid-row-start'] = (parseInt(this.liveEdit.clickedElement.style['grid-row-start']) - 1);
                    this.liveEdit.clickedElement.style['grid-row-end'] = (parseInt(this.liveEdit.clickedElement.style['grid-row-end']) - 1);
                } else {
                    console.log('move down' + boundingClientRectMove.y);
                    this.liveEdit.clickedElement.style['grid-row-start'] = (parseInt(this.liveEdit.clickedElement.style['grid-row-start']) + 1);
                    this.liveEdit.clickedElement.style['grid-row-end'] = (parseInt(this.liveEdit.clickedElement.style['grid-row-end']) + 1);
                }
            }

            let diffBetweenMoveX = Math.abs((boundingClientRectMove.x - e.clientX) / e.clientX * 100);
            if (diffBetweenMoveX > 23) {
                console.log('diffBetweenMove' + diffBetweenMoveX);
                if (boundingClientRectMove.x > e.clientX) {
                    console.log('move top' + boundingClientRectMove.x);
                    this.liveEdit.clickedElement.style['grid-column-start'] = (parseInt(this.liveEdit.clickedElement.style['grid-column-start']) - 1);
                    this.liveEdit.clickedElement.style['grid-column-end'] = (parseInt(this.liveEdit.clickedElement.style['grid-column-end']) - 1);
                } else {
                    console.log('move down' + boundingClientRectMove.x);
                    this.liveEdit.clickedElement.style['grid-column-start'] = (parseInt(this.liveEdit.clickedElement.style['grid-column-start']) + 1);
                    this.liveEdit.clickedElement.style['grid-column-end'] = (parseInt(this.liveEdit.clickedElement.style['grid-column-end']) + 1);
                }
            }
            console.log('resizeMoveNow');
        }

       instance.calculateHandlePosition();
       this.liveEdit.handles.clickedElementHandle.calculateHandlePosition();

       console.log('doDrag');
    }

    stopDrag = (e) => {

        this.iframeManager.document.removeEventListener('mousemove', this.doDrag, false);
        this.iframeManager.document.removeEventListener('mouseup', this.stopDrag, false);

        console.log('stopDrag');


        let gridRow = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-row');
        for (let i = 0; i < gridRow.length; i++) {
            gridRow[i].style['opacity'] = 0;
        }
        let gridColumn = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-column');
        for (let i = 0; i < gridColumn.length; i++) {
            gridColumn[i].style['opacity'] = 0;
        }


    }


    public appendBackgroundGridDisplay(gridRows = 18, gridColumns = 18)
    {

        let grids = this.iframeManager.document.getElementsByClassName('js-webesembly-grid');
        for (let i = 0; i < grids.length; i++) {
            let currentGrid = grids[i];

            // Add grid columns display
            for (let gridColumnI = 1; gridColumnI < gridColumns+1; gridColumnI++) {
                let gridColumn = document.createElement("div");
                gridColumn.setAttribute('style', 'grid-area: 1 / ' + gridColumnI + ' / -1 / ' + gridColumnI);
                gridColumn.classList.add('js-webesembly-grid-column');
                //gridColumn.innerHTML = 'x' + gridColumnI;

                currentGrid.append(gridColumn);
            }

            // Add grid rows display
            for (let gridRowI = 1; gridRowI < gridRows+1; gridRowI++) {
                let gridRow = document.createElement("div");
                gridRow.setAttribute('style', 'grid-area: ' + gridRowI + ' / 1 / ' + gridRowI + '/ -1');
                gridRow.classList.add('js-webesembly-grid-row');
                //gridRow.innerHTML = 'y' + gridRowI;

                currentGrid.append(gridRow);
            }

        }
    }

}
