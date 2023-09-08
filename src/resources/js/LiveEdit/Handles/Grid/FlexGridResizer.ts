import {
    allowedEditElementsList,
    getElementFriendlyName,
    elementHasParentsWithId,
    elementHasParentsWithAttribute
} from "../../helpers";
import {ElementHandle} from "./../ElementHandle";

import { deepFlat } from "@daybrush/utils";
import Selecto from "selecto";
import Moveable, { MoveableTargetGroupsType } from "moveable";
import { GroupManager, TargetList } from "@moveable/helper";

export class FlexGridResizer extends ElementHandle {

    constructor(public liveEdit) {
        super(liveEdit);
        console.log("FlexGridResizer constructor");

        const instance = this;

//
//         var head = this.iframeManager.document.getElementsByTagName('head')[0];
//
//         var resizerAppend = this.iframeManager.document.createElement('script');
//         resizerAppend.src = `//daybrush.com/moveable/release/latest/dist/moveable.min.js`;
//         head.appendChild(resizerAppend);
//
//         var scriptAppend = this.iframeManager.document.createElement('script');
//         scriptAppend.innerHTML = `
//
//
//
// setTimeout(function() {
//
//     document.querySelectorAll('[webesembly\\\\:flex-grid]').forEach((flexGrid) => {
//
// // flexGrid.querySelectorAll('[webesembly\\\\:flex-grid-element]')
//
//         const moveable = new Moveable(flexGrid, {
//             target: flexGrid.querySelectorAll('[webesembly\\\\:flex-grid-element]'),
//             // If the container is null, the position is fixed. (default: parentElement(document.body))
//             //container: document.body,
//             draggable: true,
//             resizable: true,
//             scalable: true,
//            // warpable: true,
//             // Enabling pinchable lets you use events that
//             // can be used in draggable, resizable, scalable, and rotateable.
//             // pinchable: ["resizable", "scalable"],
//             origin: true,
//             // Resize, Scale Events at edges.
//             edge: false,
//             throttleDrag: 0,
//             throttleResize: 0,
//             throttleScale: 0,
//             throttleRotate: 0,
//         });
//
//     });
//
// }, 600);
//
//
//
//
//
//
// `;
//         head.appendChild(scriptAppend);


        // instance.iframeManager.document.body.querySelectorAll('[webesembly\\:flex-grid]').forEach((flexGrid) => {
        //
        //     flexGrid.querySelectorAll('[webesembly\\:flex-grid-element]').forEach((flexGridElement) => {
        //
        // });
        // });


        instance.iframeManager.document.body.querySelectorAll('[webesembly\\:flex-grid]').forEach((flexGrid) => {

            let targets = [];
            
            // let allTargets = flexGrid.querySelectorAll('[webesembly\\:flex-grid-element]');
            // allTargets.forEach((target) => {
            //     target.addEventListener("click", (e) => {
            //         targets = [];
            //         targets.push(target);
            //         moveableRef.target = targets;
            //     });
            // });

            let moveableRef = new Moveable(flexGrid, {
                draggable: true,
                //scalable: true,
                resizable: true,
                keepRatio: false,
                target: []
            });
            let selectoRef = new Selecto({
                container: flexGrid,
                dragContainer: flexGrid,
                selectableTargets: ["[webesembly\\:flex-grid-element]"],
                hitRate: 0,
                selectByClick: true,
                selectFromInside: false,
                toggleContinueSelect: ["shift"],
                ratio: 0
            });



            function setTargets(nextTargets) {
                targets = nextTargets;
                moveableRef.target = targets;
            }
            moveableRef.on("clickGroup", e => {
                selectoRef!.clickTarget(e.inputEvent, e.inputTarget);
            });
            moveableRef.on("render", e => {
                e.target.style.cssText += e.cssText;
            });
            moveableRef.on("renderGroup", e => {
                e.events.forEach(ev => {
                    ev.target.style.cssText += ev.cssText;
                });
            });
            selectoRef.on("dragStart", (e: any) => {
                const target = e.inputEvent.target;
                if (moveableRef!.isMoveableElement(target)
                    || targets!.some(t => t === target || t.contains(target))
                ) {
                    e.stop();
                }
            });
            selectoRef.on("selectEnd", e => {
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


}
