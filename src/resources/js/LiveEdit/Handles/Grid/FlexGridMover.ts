import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import { ElementHandle } from "./../ElementHandle";

export class FlexGridMover extends ElementHandle {

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
              //  console.log(gridContainer);

                let draggingElementShadow = document.createElement("div");
                draggingElementShadow.className = 'draggingElementShadow';
                draggingElementShadow.style.userSelect = "none";
                draggingElementShadow.style.pointerEvents = "none";
                gridContainer.append(draggingElementShadow);
                //
                // console.log(item);

                let showBackgroundGrid = false;

                dragSelect.subscribe('predragmove', ({ items, isDragging, isDraggingKeyboard }) => {
                    if(isDragging) {

                        if (!showBackgroundGrid) {
                            instance.appendBackgroundGridDisplay(dragSelect.Area._node);
                            showBackgroundGrid = true;
                        }
                        //
                        // console.log('predragmove');
                        // console.log(items);

                        const gridStyles = getComputedStyle(gridContainer);

                        let cellWidth = parseFloat(gridStyles.gridTemplateColumns.split(" ")[0]);
                        let cellHeight = parseFloat(gridStyles.gridTemplateRows.split(" ")[0]);

                        // console.log('cellWidth' + cellWidth);
                        // console.log('cellHeight' + cellHeight);

                        // const gridGapX = parseFloat(gridStyles.width) - cellWidth;
                        // const gridGapY = parseFloat(gridStyles.height) - cellHeight;
                        //
                        // console.log("Grid Gap X:", gridGapX, "px");
                        // console.log("Grid Gap Y:", gridGapY, "px");


                        items.forEach((item) => {

                            const itemBound = item.getBoundingClientRect();
                            //console.log(itemBound);

                            let draggingElementGridAreaStart = {
                                gridRowStart: parseInt(item.style.gridRowStart),
                                gridRowEnd: parseInt(item.style.gridRowEnd),
                                gridColumnStart: parseInt(item.style.gridColumnStart),
                                gridColumnEnd: parseInt(item.style.gridColumnEnd),
                            };

                            const gridGap = parseFloat(gridStyles.gridGap);

                            const x = Math.floor(itemBound.x + cellWidth + gridGap);
                            const y = Math.floor(itemBound.y + cellHeight + gridGap);

                            let gridX = Math.round(((x-gridContainer.offsetLeft)+(instance.iframeManager.document.body.scrollLeft)) / Math.floor(cellWidth + gridGap));
                            let gridY = Math.round(((y-gridContainer.offsetTop)+(instance.iframeManager.document.body.scrollTop)) / Math.floor(cellHeight + gridGap));

                            // console.log('scroll-top: ' + instance.iframeManager.document.body.scrollTop);
                            // console.log('gridContainer.offsetTop: ' + gridContainer.offsetTop);
                            // console.log('y: ' + y);

                            draggingElementShadow.style.opacity = '1';
                            draggingElementShadow.style.border = '3px solid #09b0ef';

                            let newGridRowStart = gridY;
                            let newGridRowEnd = gridY + (draggingElementGridAreaStart.gridRowEnd - draggingElementGridAreaStart.gridRowStart);

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

                            //   draggingElementShadow.style.gridArea = gridY + ' / '+gridX+' / '+(gridY+1)+' / '+(gridX+1);

                    });


                    }
                });

                dragSelect.subscribe('callback', () => {
                    //console.log('callback');
                    instance.applyGridChanges(dragSelect.Area._node);
                    instance.removeBackgroundGridDisplay();
                    showBackgroundGrid = false;
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

    public appendBackgroundGridDisplay(currentGrid = null, gridRows = 21, gridColumns = 23)
    {
        if (currentGrid) {

            // Add grid columns display
            for (let gridColumnI = 1; gridColumnI < gridColumns + 1; gridColumnI++) {
                let gridColumn = document.createElement("div");
                gridColumn.setAttribute('style', 'grid-area: 1 / ' + gridColumnI + ' / -1 / ' + gridColumnI);
                gridColumn.classList.add('js-webesembly-grid-column');
                gridColumn.innerHTML = '';
                currentGrid.append(gridColumn);
            }

            const gridStyles = getComputedStyle(currentGrid);

            let cellWidth = parseFloat(gridStyles.gridTemplateColumns.split(" ")[0]);
            let cellHeight = parseFloat(gridStyles.gridTemplateRows.split(" ")[0]);
            const gridGap = parseFloat(gridStyles.gridGap);

            // Add grid rows display
            for (let gridRowI = 1; gridRowI < gridRows + 1; gridRowI++) {
                let gridRow = document.createElement("div");
                gridRow.setAttribute('style', 'grid-area: ' + gridRowI + ' / 1 / ' + gridRowI + '/ -1');
                gridRow.classList.add('js-webesembly-grid-row');

                 //gridRow.innerHTML = '';
                 gridRow.innerHTML = '' +
                    '<svg style="height: 100%; width: calc(100% - 0px); position: absolute; left: 0px;" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<pattern id="flex-grid-mover-row-'+gridRowI+ '" ' +
                    'height="100%" width="'+(cellWidth + gridGap)+'px" ' +
                    'patternUnits="userSpaceOnUse">' +
                    '<rect height="'+cellHeight+'" ' +
                    'width="'+cellWidth+'px" x="0.5" y="0.5" rx="3" ' +
                    'stroke-width="1" stroke="#B7B7B7" fill="#F2F2F240"></rect>' +
                    '</pattern>' +
                    '</defs>' +
                    '<rect width="100%" height="100%" fill="url(#flex-grid-mover-row-'+gridRowI+ ')"></rect></svg>';

                currentGrid.append(gridRow);
            }

        }
    }

}
