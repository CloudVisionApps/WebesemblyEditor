import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

import Selecto from "selecto";
import Moveable, { MoveableTargetGroupsType } from "moveable";
const Parser = require('boreas/lib/parser');
var AST = require('boreas/lib/ast');

export class FlexGridResizer extends ElementHandle {

    constructor(public liveEdit) {
        super(liveEdit);
        console.log("FlexGridResizer constructor");

        const instance = this;

        instance.iframeManager.document.body.querySelectorAll('.webesembly-flex-grid').forEach((flexGrid) => {

            // Add Style To Flex Grid

            let flexGridId = Math.floor(Math.random() * 1000000000);
            let flexGridClass = "webesembly-flex-grid-" + flexGridId;
            let flexGridStyleClass = "webesembly-flex-grid-style-" + flexGridId;
            let flexGridTemplateColumns = 12;
            let flexGridTemplateRows = 12;
            let flexGridGap = 2;
            if (flexGrid.hasAttribute('data-grid-template-columns')) {
                flexGridTemplateColumns = parseInt(flexGrid.getAttribute('data-grid-template-columns'));
            }
            if (flexGrid.hasAttribute('data-grid-template-rows')) {
                flexGridTemplateRows = parseInt(flexGrid.getAttribute('data-grid-template-rows'));
            }
            if (flexGrid.hasAttribute('data-grid-gap')) {
                flexGridGap = parseInt(flexGrid.getAttribute('data-grid-gap'));
            }
            let flexGridStyle = document.createElement("style");
            flexGridStyle.className = flexGridStyleClass;
            flexGridStyle.innerHTML = `
            .${flexGridClass} {
                display: grid;
                grid-template-columns: repeat(${flexGridTemplateColumns}, 1fr);
                grid-template-rows: repeat(${flexGridTemplateRows}, 1fr);
                grid-gap: ${flexGridGap}px;
                width: 100%;
                height: 600px;
            }
            `;
            flexGrid.before(flexGridStyle);
            flexGrid.classList.add(flexGridClass);

            flexGrid.querySelectorAll('.webesembly-flex-grid-block').forEach((flexGridBlock) => {
                let flexGridBlockId = Math.floor(Math.random() * 1000000000);
                let flexGridBlockClass = "webesembly-flex-grid-block-" + flexGridBlockId;
                let flexGridBlockStyleClass = "webesembly-flex-grid-block-style-" + flexGridBlockId;
                let flexGridBlockGridArea = "1 / 1 / 2 / 2";
                if (flexGridBlock.hasAttribute('data-grid-area')) {
                    flexGridBlockGridArea = flexGridBlock.getAttribute('data-grid-area');
                }

                let flexGridBlockStyle = document.createElement("style");
                flexGridBlockStyle.className = flexGridBlockStyleClass;
                flexGridBlockStyle.innerHTML = `
                .${flexGridBlockClass} {
                    grid-area: ${flexGridBlockGridArea};
                }
                `;
                flexGrid.before(flexGridBlockStyle);
                flexGridBlock.classList.add(flexGridBlockClass);

            });

            // Add Background Grid Display
            instance.appendBackgroundGridDisplay(flexGrid);

            let targets = [];

            let moveableRef = new Moveable(flexGrid, {
                draggable: true,
                //scalable: true,
                resizable: true,
                keepRatio: false,
                target: [],
                preventDefault: false,
                stopPropagation: false,
            });

            let selectoRef = new Selecto({
                container: flexGrid,
                dragContainer: flexGrid,
                selectableTargets: [".webesembly-flex-grid-block"],
                hitRate: 0,
                selectByClick: true,
                selectFromInside: false,
                toggleContinueSelect: ["shift"],
                ratio: 0
            });

            let showingGrid = false;

            function setTargets(nextTargets) {
                targets = nextTargets;
                moveableRef.target = targets;
            }
            moveableRef.on("clickGroup", e => {
                selectoRef!.clickTarget(e.inputEvent, e.inputTarget);
            });
            // moveableRef.on("dragEnd", e => {
            //     console.log('dragEnd');
            //     instance.hideBackgroundGridDisplay(flexGrid);
            //     showingGrid = false;
            //     setTargets([]);
            // });
            moveableRef.on("render", e => {
                 e.target.style.cssText += e.cssText;
                 console.log('render');
                 console.log(e.cssText);
                 e.target.style.transform = e.transform;
                if (!showingGrid) {
                    instance.showBackgroundGridDisplay(flexGrid);
                    showingGrid = true;
                }
                instance.moveElementInGrid(flexGrid, e.target);
                instance.liveEdit.draggedElement = e.target;

            });
            moveableRef.on("renderGroup", e => {
                if (!showingGrid) {
                    instance.showBackgroundGridDisplay(flexGrid);
                    showingGrid = true;
                }
                e.events.forEach(ev => {
                    ev.target.style.cssText += ev.cssText;
                    instance.moveElementInGrid(flexGrid, ev.target);
                });
                 console.log('renderGroup');
            });
            selectoRef.on("dragStart", (e: any) => {
                const target = e.inputEvent.target;
                if (moveableRef!.isMoveableElement(target)
                    || targets!.some(t => t === target || t.contains(target))
                ) {
                    e.stop();
                }
            });
            selectoRef.on('select', e => {
                console.log('select');
                console.log(e.selected);
                setTargets(e.selected);
            });
            selectoRef.on("selectEnd", e => {

                instance.hideBackgroundGridDisplay(flexGrid);
                instance.applyGridChanges(flexGrid);
                instance.liveEdit.draggedElement = null;
                showingGrid = false;

                if (e.isDragStartEnd) {
                    e.inputEvent.preventDefault();
                    moveableRef!.waitToChangeTarget().then(() => {
                        moveableRef!.dragStart(e.inputEvent);
                    });
                }
                setTargets(e.selected);
            });

        });
    }

    public moveElementInGrid(gridContainer, item) {

        let instance = this;

        const gridStyles = getComputedStyle(gridContainer);

        let cellWidth = parseFloat(gridStyles.gridTemplateColumns.split(" ")[0]);
        let cellHeight = parseFloat(gridStyles.gridTemplateRows.split(" ")[0]);

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

        const bottom = Math.floor(itemBound.bottom + cellWidth + gridGap);
        const right = Math.floor(itemBound.right + cellHeight + gridGap);

        let gridX = Math.round(((x-gridContainer.offsetLeft)+(instance.iframeManager.document.body.scrollLeft)) / Math.floor(cellWidth + gridGap));
        let gridY = Math.round(((y-gridContainer.offsetTop)+(instance.iframeManager.document.body.scrollTop)) / Math.floor(cellHeight + gridGap));

        let gridRight = Math.round(((right-gridContainer.offsetLeft)+(instance.iframeManager.document.body.scrollLeft)) / Math.floor(cellWidth + gridGap));
        let gridBottom = Math.floor(((bottom-gridContainer.offsetTop)+(instance.iframeManager.document.body.scrollTop)) / Math.floor(cellHeight + gridGap));

        // console.log('scroll-top: ' + instance.iframeManager.document.body.scrollTop);
        // console.log('gridContainer.offsetTop: ' + gridContainer.offsetTop);
        // console.log('y: ' + y);

      //  draggingElementShadow.style.opacity = '1';
      //  draggingElementShadow.style.border = '3px solid #09b0ef';

        let newGridRowStart = gridY;
     //   let newGridRowEnd = gridY + (draggingElementGridAreaStart.gridRowEnd - draggingElementGridAreaStart.gridRowStart);
        let newGridRowEnd = gridBottom;

      //  if (newGridRowEnd < 22) {
        //    draggingElementShadow.style.gridRowStart = newGridRowStart + '';
          //  draggingElementShadow.style.gridRowEnd = newGridRowEnd + '';

            item.setAttribute('data-grid-row-start', newGridRowStart);
            item.setAttribute('data-grid-row-end', newGridRowEnd);
        //}

        let newGridColumnStart = gridX;
       // let newGridColumnEnd = gridX + (draggingElementGridAreaStart.gridColumnEnd - draggingElementGridAreaStart.gridColumnStart);
        let newGridColumnEnd = gridRight;

        // console.log('newGridColumnStart' + newGridColumnStart);
        // console.log('newGridColumnEnd' + newGridColumnEnd);

        //if (newGridColumnEnd < 22) {
           // draggingElementShadow.style.gridColumnStart = newGridColumnStart + '';
           // draggingElementShadow.style.gridColumnEnd = newGridColumnEnd + '';

            item.setAttribute('data-grid-column-start', newGridColumnStart);
            item.setAttribute('data-grid-column-end', newGridColumnEnd);
        //}
    }

    public applyGridChanges(flexGrid) {

        console.log('applyGridChanges');

        if (flexGrid) {
            flexGrid.querySelectorAll('.webesembly-flex-grid-block').forEach((flexGridBlock) => {

                if (
                    flexGridBlock.getAttribute('data-grid-row-start') &&
                    flexGridBlock.getAttribute('data-grid-row-end') &&
                    flexGridBlock.getAttribute('data-grid-column-start') &&
                    flexGridBlock.getAttribute('data-grid-column-end')

                ) {
                    // flexGridBlock.style.gridRowStart = flexGridBlock.getAttribute('data-grid-row-start');
                    // flexGridBlock.style.gridRowEnd = flexGridBlock.getAttribute('data-grid-row-end');
                    // flexGridBlock.style.gridColumnStart = flexGridBlock.getAttribute('data-grid-column-start');
                    // flexGridBlock.style.gridColumnEnd = flexGridBlock.getAttribute('data-grid-column-end');
                    //
                    flexGridBlock.style.transform = '';
                    flexGridBlock.style.width = '';
                    flexGridBlock.style.height = '';

                    let flexGridBlockNewGridArea = flexGridBlock.getAttribute('data-grid-row-start')
                        + ' / ' + flexGridBlock.getAttribute('data-grid-column-start')
                        + ' / ' + flexGridBlock.getAttribute('data-grid-row-end')
                        + ' / ' + flexGridBlock.getAttribute('data-grid-column-end');

                    let flexGridBlockId = '';
                    flexGridBlock.classList.forEach((className) => {
                        if (className.indexOf('webesembly-flex-grid-block-') > -1) {
                            flexGridBlockId = className.replace('webesembly-flex-grid-block-', '');
                        }
                    });

                    console.log(flexGridBlockId);

                    let findStyleElement = this.iframeManager.document.getElementsByClassName('webesembly-flex-grid-block-style-' + flexGridBlockId);
                    if (findStyleElement) {

                        let src = findStyleElement[0].innerHTML;
                        let ast = Parser.parse(src);

                        ast.getRules().forEach(function (rule) {
                            if (rule.getSelectors().toString().trim() == '.webesembly-flex-grid-block-' + flexGridBlockId) {
                                rule.getDeclarations().forEach(function (declaration) {
                                    if (declaration.getName() == 'grid-area') {
                                        declaration.setValue(flexGridBlockNewGridArea);
                                    }
                                });
                            }
                        })

                        console.log(ast.toString());

                        findStyleElement[0].innerHTML = ast.toString();
                    }
                }
            });
        }
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

    public hideBackgroundGridDisplay(currentGrid)
    {
        if (currentGrid) {
            let findGridRow = currentGrid.getElementsByClassName('js-webesembly-grid-row');
            if (findGridRow.length > 0) {
                for (let i = 0; i < findGridRow.length; i++) {
                    findGridRow[i].style.opacity = '0';
                }
            }
        }
    }

    public showBackgroundGridDisplay(currentGrid)
    {
        if (currentGrid) {
            let findGridRow = currentGrid.getElementsByClassName('js-webesembly-grid-row');
            if (findGridRow.length > 0) {
                for (let i = 0; i < findGridRow.length; i++) {
                    findGridRow[i].style.opacity = '0.1';
                }
            }
        }
    }

    public appendBackgroundGridDisplay(currentGrid = null, gridRows = 21, gridColumns = 23)
    {
        if (currentGrid) {

            let uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2);;

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
                gridRow.style.opacity = '0';

                //gridRow.innerHTML = '';
                gridRow.innerHTML = '' +
                    '<svg style="height: 100%; width: calc(100% - 0px); position: absolute; left: 3px;" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<pattern id="flex-grid-mover-row-'+uniqueId+gridRowI+ '" ' +
                    'height="100%" width="'+(cellWidth + gridGap)+'px" ' +
                    'patternUnits="userSpaceOnUse">' +
                    '<rect height="'+cellHeight+'" ' +
                    'width="'+cellWidth+'px" fill="#fff" x="0.5" y="0.5" ' +
                    'stroke-width="1"></rect>' +
                    '</pattern>' +
                    '</defs>' +
                    '<rect width="100%" height="100%" fill="url(#flex-grid-mover-row-'+uniqueId+gridRowI+ ')"></rect></svg>';

                currentGrid.append(gridRow);
            }

        }
    }

}
