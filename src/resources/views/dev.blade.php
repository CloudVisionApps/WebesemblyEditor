<div class="grid-container">
    <div class="item draggable">Item 1</div>
    <div class="item draggable">Item 2</div>
    <div class="item draggable">Item 3</div>
    <div class="item draggable">Item 4</div>
</div>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(20, 1fr);
        grid-template-rows: repeat(20, 1fr);
        grid-gap: 10px;
        position: relative;
    }

    .item {
        background-color: #ee6363;
        text-align: center;
        cursor: move;
    }

    .grid-container::before {
        user-select: none;
        pointer-events: none;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(#aaa 1px, transparent 1px), linear-gradient(90deg, #aaa 1px, transparent 1px);
        background-size: 21px 21px;
    }
</style>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        const draggableElements = document.querySelectorAll(".draggable");
        let draggingElement = null;
        let offsetX = 0;
        let offsetY = 0;
        let gridY = 0;
        let gridX = 0;

        function startDragging(e) {
            draggingElement = this;
            offsetX = e.clientX - draggingElement.getBoundingClientRect().left;
            offsetY = e.clientY - draggingElement.getBoundingClientRect().top;

            draggingElement.style.zIndex = 9999;
            draggingElement.style.gridArea = "";
            draggingElement.style.position = "absolute";
            draggingElement.style.pointerEvents = "none";
            //draggingElement.style.transition = "transform 0.04s ease-in-out"; // Added transition effect

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }

        draggableElements.forEach(function(element) {
            element.addEventListener("mousedown", startDragging);
        });

        function onMouseMove(e) {
            if (draggingElement) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;

                const gridContainer = document.querySelector(".grid-container");
                let cellWidth = parseFloat(getComputedStyle(gridContainer).gridTemplateColumns.split(" ")[0]);
                let cellHeight = parseFloat(getComputedStyle(gridContainer).gridTemplateRows.split(" ")[0]);

                let cellWidthSmoothly = 1;
                let cellHeightSmoothly = 1;

                let gridXSmoothly = Math.floor(x / cellWidthSmoothly);
                let gridYSmoothly = Math.floor(y / cellHeightSmoothly);

                gridX = Math.floor(x / cellWidth);
                gridY = Math.floor(y / cellHeight);

                draggingElement.style.transform = `translate(${gridXSmoothly * cellWidthSmoothly}px, ${gridYSmoothly * cellHeightSmoothly}px)`; // Smooth transition

                // Optionally, you can also update the grid area position for accuracy (uncomment the line below)
               //draggingElement.style.gridArea = `${gridY} / ${gridX} / span 1 / span 1`;

            }
        }

        function onMouseUp() {
            if (draggingElement) {

                draggingElement.style.zIndex = "";
                draggingElement.style.position = "";
                draggingElement.style.pointerEvents = "";
                draggingElement.style.transition = ""; // Remove transition effect
                draggingElement.style.transform = "";
                draggingElement.style.gridArea = `${gridY} / ${gridX} / span 1 / span 1`;


                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }
        }
    });


</script>
