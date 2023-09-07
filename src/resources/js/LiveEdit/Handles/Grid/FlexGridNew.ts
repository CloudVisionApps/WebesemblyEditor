import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import { ElementHandle } from "./../ElementHandle";

export class FlexGridNew extends ElementHandle {

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
