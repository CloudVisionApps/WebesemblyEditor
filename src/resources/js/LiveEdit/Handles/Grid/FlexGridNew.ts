import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import { ElementHandle } from "./../ElementHandle";

export class FlexGridNew extends ElementHandle {

    public currentFlexGrid = null;
    public flexGridElement = null;

    public draggingElement = null;
    public draggingElementShadow = null;

    public draggingElementGridAreaStart = null;
    public newGridAreaForElement = {
            gridRowStart: 0,
            gridRowEnd: 0,
            gridColumnStart: 0,
            gridColumnEnd: 0,
        };

    public originalX =0;
    public originalY = 0;
    public offsetX = 0;
    public offsetY = 0;

    public gridY = 0;
    public gridX = 0;

    public isDragging = false;
    public initialTransform = null;

    constructor(public liveEdit) {

        super(liveEdit);

        let instance = this;

        console.log("FlexGridNew constructor");

        var head = this.iframeManager.document.getElementsByTagName('head')[0];

        var dragselectAppend = this.iframeManager.document.createElement('script');
        dragselectAppend.src = `https://unpkg.com/dragselect@latest/dist/ds.min.js`;
        head.appendChild(dragselectAppend);

        var scriptDraggable = this.iframeManager.document.createElement('script');
        scriptDraggable.innerHTML = `
        window.webesemblyDragSelectInstances = {};
        setTimeout(function() {

        let dragSelectI = 0;
        document.querySelectorAll('[webesembly\\\\:flex-grid]').forEach((flexGrid) => {

            let dragSelect = new DragSelect({
              selectables: flexGrid.querySelectorAll('[webesembly\\\\:flex-grid-element]'),
              area: flexGrid
            });

            window.webesemblyDragSelectInstances[dragSelectI] = dragSelect;
            dragSelectI++;
        });

}, 600);

`;
        head.appendChild(scriptDraggable);

        setTimeout(function() {
            Object.keys(instance.iframeManager.window.webesemblyDragSelectInstances).forEach(key => {
                let dragSelect = instance.iframeManager.window.webesemblyDragSelectInstances[key];

                let gridContainer = dragSelect.Area._node;

                let draggingElementShadow = document.createElement("div");
                draggingElementShadow.style.userSelect = "none";
                draggingElementShadow.style.pointerEvents = "none";
                gridContainer.appendChild(draggingElementShadow);

                dragSelect.subscribe('predragmove', ({ items, isDragging, isDraggingKeyboard }) => {
                    if(isDragging) {
                        console.log('predragmove');
                        console.log(items);

                        let cellWidth = parseFloat(getComputedStyle(gridContainer).gridTemplateColumns.split(" ")[0]);
                        let cellHeight = parseFloat(getComputedStyle(gridContainer).gridTemplateRows.split(" ")[0]);

                        console.log('cellWidth' + cellWidth);
                        console.log('cellHeight' + cellHeight);

                        items.forEach((item) => {
                        //    console.log(item);
                        const itemBound = item.getBoundingClientRect();
                      //  console.log(itemBound);


                        let draggingElementGridAreaStart = {
                            gridRowStart: parseInt(item.style.gridRowStart),
                            gridRowEnd: parseInt(item.style.gridRowEnd),
                            gridColumnStart: parseInt(item.style.gridColumnStart),
                            gridColumnEnd: parseInt(item.style.gridColumnEnd),
                        };

                        const x = itemBound.x;
                        const y = itemBound.y;

                        let gridX = Math.round(x / cellWidth) + 1;
                        let gridY = Math.round(((y-gridContainer.offsetTop)+(document.body.scrollTop)) / (cellHeight));



                        // draggingElementShadow.style.opacity = 1;
                        draggingElementShadow.style.border = '6px solid #09b0ef';


                        let newGridRowStart = gridY;
                        let newGridRowEnd =  gridY + (draggingElementGridAreaStart.gridRowEnd - draggingElementGridAreaStart.gridRowStart);

                        if (newGridRowEnd < 22) {
                            draggingElementShadow.style.gridRowStart = newGridRowStart + '';
                            draggingElementShadow.style.gridRowEnd = newGridRowEnd + '';

                            item.setAttribute('data-grid-row-start', newGridRowStart);
                            item.setAttribute('data-grid-row-end', newGridRowEnd);
                        }

                        let newGridColumnStart = gridX;
                        let newGridColumnEnd = gridX + (draggingElementGridAreaStart.gridColumnEnd - draggingElementGridAreaStart.gridColumnStart);

                        // console.log('newGridColumnStart' + newGridColumnStart);
                        // console.log('newGridColumnEnd' + newGridColumnEnd);

                        if (newGridColumnEnd < 22) {
                            draggingElementShadow.style.gridColumnStart = newGridColumnStart + '';
                            draggingElementShadow.style.gridColumnEnd = newGridColumnEnd + '';

                            item.setAttribute('data-grid-column-start', newGridColumnStart);
                            item.setAttribute('data-grid-column-end', newGridColumnEnd);
                       }

                        //draggingElementShadow.style.gridArea = gridY + ' / '+gridX+' / '+(gridY+1)+' / '+(gridX+1);
                    });


                    }
                });

                dragSelect.subscribe('dragstart', (e) => {
                    console.log('dragstart');
                    instance.appendBackgroundGridDisplay(dragSelect.Area._node);
                });

                dragSelect.subscribe('callback', () => {
                    console.log('callback');
                    instance.applyGridChanges(dragSelect.Area._node);
                    instance.removeBackgroundGridDisplay();
                });

            });
        }, 1000);

    }

    public applyGridChanges(flexGridElement) {
        console.log('applyGridChanges');
        if (flexGridElement) {
            flexGridElement.querySelectorAll('[webesembly\\:flex-grid-element]').forEach((flexGridElement) => {
                if (
                    flexGridElement.getAttribute('data-grid-row-start') &&
                    flexGridElement.getAttribute('data-grid-row-end') &&
                    flexGridElement.getAttribute('data-grid-column-start') &&
                    flexGridElement.getAttribute('data-grid-column-end')

                ) {
                    flexGridElement.style.gridRowStart = flexGridElement.getAttribute('data-grid-row-start');
                    flexGridElement.style.gridRowEnd = flexGridElement.getAttribute('data-grid-row-end');
                    flexGridElement.style.gridColumnStart = flexGridElement.getAttribute('data-grid-column-start');
                    flexGridElement.style.gridColumnEnd = flexGridElement.getAttribute('data-grid-column-end');
                    flexGridElement.style.transform = '';
                }
            });
        }
    }

    startDragging = (e) => {

        console.log('startDragging');
        let instance = this;

        this.appendBackgroundGridDisplay(instance.currentFlexGrid);

        if (!instance.draggingElementShadow) {
            let draggingElementShadow = document.createElement("div");
            draggingElementShadow.style.userSelect = "none";
            draggingElementShadow.style.pointerEvents = "none";
            instance.currentFlexGrid.appendChild(draggingElementShadow);

            instance.draggingElementShadow = draggingElementShadow;
        }

        instance.draggingElementGridAreaStart = {
            gridRowStart: instance.draggingElement.style.gridRowStart,
            gridRowEnd: instance.draggingElement.style.gridRowEnd,
            gridColumnStart: instance.draggingElement.style.gridColumnStart,
            gridColumnEnd: instance.draggingElement.style.gridColumnEnd,
        };

        instance.draggingElementShadow.style.opacity = 1;
        instance.draggingElementShadow.style.border = '3px solid #09b0ef';
        instance.draggingElementShadow.style.gridArea = instance.draggingElement.style.gridArea;

        instance.originalX = instance.draggingElement.getBoundingClientRect().left;
        instance.originalY = instance.draggingElement.getBoundingClientRect().top;

        instance.offsetX = e.clientX - instance.draggingElement.getBoundingClientRect().left;
        instance.offsetY = e.clientY - instance.draggingElement.getBoundingClientRect().top;

        this.iframeManager.document.addEventListener('mousemove', this.doDragging, false);
        this.iframeManager.document.addEventListener('mouseup', this.stopDragging, false);

    }

    doDragging = (e) => {

        console.log('doDragging');

        let instance = this;

        if (instance.draggingElement) {

            const x = e.clientX - instance.offsetX;
            const y = e.clientY - instance.offsetY;

            console.log('x' + x);
            console.log('y' + y);

            let cellWidth = parseFloat(getComputedStyle(instance.currentFlexGrid).gridTemplateColumns.split(" ")[0]);
            let cellHeight = parseFloat(getComputedStyle(instance.currentFlexGrid).gridTemplateRows.split(" ")[0]);

            //console.log(instance.currentFlexGrid);

            // console.log(cellWidth);
            // console.log(cellHeight);

            instance.gridX = Math.floor(x / cellWidth);
            //instance.gridY = Math.floor(y / cellHeight);
            instance.gridY = Math.floor(((y-instance.currentFlexGrid.offsetTop)+(this.iframeManager.body.scrollTop)) / (cellHeight));



            //
            // console.log('instance.gridX' + instance.gridX);
            // console.log('instance.gridY' + instance.gridY);


            let gridXSmoothly = (x-instance.originalX) - (cellWidth);
            let gridYSmoothly = (y-instance.originalY) - (cellHeight);

            // console.log('gridXSmoothly' + gridXSmoothly);
            // console.log('gridYSmoothly' + gridYSmoothly);

            instance.draggingElement.style.transform = `translate(${gridXSmoothly}px, ${gridYSmoothly}px)`; // Smooth transition

            // Optionally, you can also update the grid area position for accuracy (uncomment the line below)


            if (instance.canIMoveY(instance.gridY) && instance.canIMoveX(instance.gridX)) {

               // console.log('instance.gridY' + instance.gridY);

                let newGridRowStart = instance.gridY;
                let newGridRowEnd =  instance.gridY + (instance.draggingElementGridAreaStart.gridRowEnd - instance.draggingElementGridAreaStart.gridRowStart);

                if (newGridRowEnd < 22) {
                    instance.newGridAreaForElement['gridRowStart'] = newGridRowStart;
                    instance.newGridAreaForElement['gridRowEnd'] = newGridRowEnd;
                    instance.draggingElementShadow.style.gridRowStart = newGridRowStart;
                    instance.draggingElementShadow.style.gridRowEnd = newGridRowEnd;
                }



               // console.log('instance.gridX' + instance.gridX);

                let newGridColumnStart = instance.gridX;
                let newGridColumnEnd = instance.gridX + (instance.draggingElementGridAreaStart.gridColumnEnd - instance.draggingElementGridAreaStart.gridColumnStart);

                // console.log('newGridColumnStart' + newGridColumnStart);
                // console.log('newGridColumnEnd' + newGridColumnEnd);

                if (newGridColumnEnd < 22) {

                    instance.newGridAreaForElement['gridColumnStart'] = newGridColumnStart;
                    instance.newGridAreaForElement['gridColumnEnd'] = newGridColumnEnd;

                    instance.draggingElementShadow.style.gridColumnStart = newGridColumnStart;
                    instance.draggingElementShadow.style.gridColumnEnd = newGridColumnEnd;
                }
            }

        }
    }

    isNegative = (num) => {

        if (Math.sign(num) === -1) {
            return true;
        }

        return false;
    }
    canIMoveY = (gridY) => {
        let canIMove = true;

        if (this.isNegative(gridY)) {
            canIMove = false;
        }
        if (gridY == 0) {
            canIMove = false;
        }
        return canIMove;
    }
    canIMoveX = (gridX) => {
        let canIMove = true;

        if (this.isNegative(gridX)) {
            canIMove = false;
        }
        if (gridX == 0) {
            canIMove = false;
        }
        return canIMove;
    }

    stopDragging = (e) => {

        //console.log('stopDragging');

        let instance = this;

        instance.removeBackgroundGridDisplay();

        if (instance.draggingElement) {

            // draggingElement.style.transition = ""; // Remove transition effect
            instance.draggingElement.style.transform = "";

            //console.log(instance.newGridAreaForElement);

            instance.draggingElement.style.gridRowStart = instance.newGridAreaForElement['gridRowStart'];
            instance.draggingElement.style.gridRowEnd =  instance.newGridAreaForElement['gridRowEnd'];
            instance.draggingElement.style.gridColumnStart = instance.newGridAreaForElement['gridColumnStart'];
            instance.draggingElement.style.gridColumnEnd = instance.newGridAreaForElement['gridColumnEnd'];

            instance.draggingElementShadow.style.opacity = 0;

        }
        //
        // this.iframeManager.document.removeEventListener('mousemove', this.doDragging, false);
        // this.iframeManager.document.removeEventListener('mouseup', this.stopDragging, false);

    }

    public removeBackgroundGridDisplay()
    {
        let gridRow = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-row');
        while(gridRow.length > 0){
            gridRow[0].parentNode.removeChild(gridRow[0]);
        }

        let gridColumn = this.iframeManager.document.getElementsByClassName('js-webesembly-grid-column');
        while(gridColumn.length > 0){
            gridColumn[0].parentNode.removeChild(gridColumn[0]);
        }
    }

    public appendBackgroundGridDisplay(currentGrid = null, gridRows = 20, gridColumns = 20)
    {
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
